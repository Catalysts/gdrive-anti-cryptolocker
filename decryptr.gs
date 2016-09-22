// Google App Scripts timeout after 6 minutes !
// 
// This script was written to recovery encrypted files after 
// a cryptolocker attack. It deletes all revisions with the
// fileending ".enc", restoring the last one before encrypting
// the files.
//
// requires Advanced Drive Services:
// https://developers.google.com/apps-script/advanced/drive

var enc = ".enc"

var dry = true; // set to false to decrypt, logging only

function decryptr() {
  var files = DriveApp.getFiles();
  var filesCount = 0;
  var revisionsCount = 0;
  var filesWithRevisionsCount = 0;
  var count = 0;
 
  while (files.hasNext()) {
    var file = files.next();
    var name = file.getName();
    
    if (isEncrypted(name)) {
       var id = file.getId();
      
       // delete all encrypted revisions
       var rcount = removeEncryptedRevisions(id);
       if (rcount == 0) {
         Logger.log('No revision to delete for %s', id);
       } else {
         filesWithRevisionsCount++;
       }
       
       // rename back
       var newName = name.substring(0, name.length - enc.length);
       Logger.log('Rename %s back to %s', name, newName);
       if (!dry) { file.setName(newName); }
       
       revisionsCount += rcount;
       filesCount++;
    }
  }
  
  Logger.log("files with .enc extension: " + filesCount);
  Logger.log("files with revisions to delete: " + filesWithRevisionsCount);
  Logger.log("revision deleted: " + revisionsCount);
}

function isEncrypted(name) {
  return (name.length >= 4 && name.substring(name.length-enc.length)==enc)
}

function removeEncryptedRevisions(fileId) {
  var count = 0;
  
  var revisions = Drive.Revisions.list(fileId);
  if (revisions.items && revisions.items.length > 0) {
    for (var i = 0; i < revisions.items.length; i++) {
      var revision = revisions.items[i];
      
      if (!revision.originalFilename) {
        Logger.log('Invalid originalFilename for file %s and revision %s', fileId, revision.id);
      } else {
        if (isEncrypted(revision.originalFilename)) {
          var date = new Date(revision.modifiedDate);
          Logger.log('Date: %s, File size (bytes): %s File name: %s ChangedBy: %s Revision: %s', date.toLocaleString(),
                     revision.fileSize, revision.originalFilename, revision.lastModifyingUser.displayName, revision.id);
          if (!dry) { Drive.Revisions.remove(fileId, revision.id); }
          count++;
        }
      }
    }
  }
  return count;
}

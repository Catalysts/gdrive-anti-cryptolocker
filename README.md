# Google Drive CryptoLocker restore script

## Introduction

One of our colleges got hit today by the CryptoLocker virus, some of them were synced to Google Drive. Thankfully Google Drive stores all versions of modified files, so an older, unencrypted version can be restored. The virus encrypted about ~1000 files on his Google Drive, so we've written a script to programmatically restore them all.

## Requirements / Usage
This script can be executed via [Google Apps Scripts](https://www.google.com/script/start/). You have to enable those, as well as [Advanced Drive Services](https://developers.google.com/apps-script/advanced/drive) for accessing file revisions. After that you can save the decryptr.gs into your Google Drive using the Webinterface and just run the `decryptr` function. You can now take a look at your log file, if those look good enough you can switch the `dry` switch to `false` to really recover those files.

# How it works
This script was designed to crawl through your whole Google drive, removing all revisions of files having `.enc` as file ending. Afterwards it renames the file, removing the `.enc` postfix from them (the filename is not getting restored when removing the revisions).

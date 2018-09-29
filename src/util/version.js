const git = require('git-last-commit');
const fs  = require('fs');
const path = require('path');
module.exports = new Promise((res, rej) => {
    
    git.getLastCommit((err, commit) => {
        if(err) {
            rej(err);  
        } else {
            // multiply for 1000 to pass from unix to js
            const date = new Date(Number.parseInt(commit.committedOn*1000)).toUTCString()
            const name = `${date} - ${commit.shortHash}`;
            const msg = commit.subject;
            fs.writeFileSync(
                path.resolve(path.join(__dirname,'../info/version.json')),
                JSON.stringify({name, msg}));
            console.log('new version generated:', {name, msg});
            res();
        }
    });
});


// Commit structure
// {
//     "shortHash": "d2346fa",
//     "hash": "d2346faac31de5e954ef5f6baf31babcd3e899f2",
//     "subject": "initial commit",
//     "sanitizedSubject": "initial-commit",
//     "body": "this is the body of the commit message",
//     "authoredOn": "1437988060",
//     "committedOn": "1437988060",
//     "author": {
//       "name": "Ozan Seymen",
//       "email": "oseymen@gmail.com"
//     },
//     "committer": {
//       "name": "Ozan Seymen",
//       "email": "oseymen@gmail.com"
//     },
//     "notes": "commit notes",
//     "branch": "master",
//     "tags": ['R1', 'R2']
//   }
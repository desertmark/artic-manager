const PORT_NUMBER = process.env.PORT || 3001 ;
const git         = require('git-last-commit');
const config      = require('../config/config.js');
module.exports = new Promise((res, rej) => {
    git.getLastCommit((err, commit) => {
        if(err) {
            rej(err);  
        } else {
            // multiply for 1000 to pass from unix to js
            const date = new Date(Number.parseInt(commit.committedOn*1000)).toUTCString()
            const version = `${date} - ${commit.shortHash}`;
            const msg = commit.subject;
            
            const info = {
                status: `App is running on port: ${PORT_NUMBER}`,
                env: config.env,
                version,
                msg
            }
            res(info);
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
const { exec } = require('child_process');

const execSync = require('child_process').execSync;

const slug = process.env.npm_config_slug;
if(!slug)
{
    console.error("***Manca lo slug!***");
    return;
}

console.table({
    "tipo" : "Book review",
    "slug" : slug
});

execSync('git checkout master');
execSync('git pull');
execSync('git checkout -b book/'+slug);
execSync('hugo new --kind book book-review/'+slug+'/');

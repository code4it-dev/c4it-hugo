const execSync = require('child_process').execSync;

const slug = process.env.npm_config_slug;
if(!slug)
{
    console.error("***Manca lo slug!***");
    return;
}

console.table({
    "tipo" : "Main Article",
    "slug" : slug
});

execSync('git checkout master');
execSync('git pull');
execSync('git checkout -b article/'+slug);
execSync('hugo new --kind article article/2025/'+slug+'/');
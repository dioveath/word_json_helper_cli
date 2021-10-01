const fs = require('fs');

var fileName = "word-search-aed56-default-rtdb-export.json";
var file = fs.readFileSync(fileName);

var jsonObject = JSON.parse(file.toLocaleString());

var categories = jsonObject['GameData']['Categories'];
var words = jsonObject['GameData']['words'];

function listCategories(){
  var categoriesSorted = [];
  for(var prop in categories){
    // console.log(categories[prop].name);
    categoriesSorted.push(categories[prop].name);
  }

  categoriesSorted.sort();
  for(var categoryName of categoriesSorted)
    console.log(categoryName);
} 


function addCategory(categoryName){
  categories.push({
    isVisible: true,
    name: categoryName
  });
}

function removeCategory(categoryName){
  for(var prop in categories){
    if(categories[prop] == null || categories[prop].name == categoryName) {
      delete categories[prop];
    }
  }
}


// listCategories();
// console.log("-------");
// listWords("Places");


function listWords(categoryName){
  for(var prop in words['Categories']){
    if(categoryName == prop) {
      console.log(words['Categories'][prop]);
      return;
    }
  }
  console.log("Couldn't find category, " + categoryName);
}


function addWord(wordName, categoryName){
  for(var prop in categories){
    if(categoryName == categories[prop].name) {

      // NOTE: if there is not defined in words but defined in categories
      // we need to create here too.
      if(words['Categories'][categoryName] === undefined) {
        words['Categories'][categoryName] = [];
      }

      words['Categories'][categoryName].push({
        difficulty: wordName.length <= 4 ? 'easy' : wordName.length <= 6 ? 'medium' : 'hard',
        name: wordName
      });
      return;
    }
  }

  console.log("Couldn't find category, " + categoryName);  
}

function removeWord(wordName, categoryName){
  for(var prop in categories){
    if(categoryName == categories[prop].name) {
      if(words['Categories'][categoryName] === undefined) {
        console.log("Couldn't find category, " + categoryName);    
        return;
      }

      var wordIndex = words['Categories'][categoryName].findIndex((e) => e.name == wordName);

      if(wordIndex <= -1)  {
        console.log("No word found to remove, " + wordName);
        return;
      }

      words['Categories'][categoryName].splice(wordIndex, 1);
    }
  }

}



function syncFile(){
  fs.writeFileSync(fileName, JSON.stringify(jsonObject, null, 2));
}


const Commander = require('commander');

const currentVersion = '0.0.1';

const program = new Commander.Command();
program.version(currentVersion);

program
  .option('-v', '--version, "Displays the CLI Version"')
  .option('-d', '--debug, "Outputs extra debugging"');


program
  .command('word <action> [category] [word]')
  .description('<action> a [word] in [category].')
  .action(wordsAction);

program
  .command('category <action> [category]')
  .description('<action> a [category].')
  .action(categoryAction);

program
  .command('test')
  .description('tests anything while developing')
  .action(testAnything);

const options = program.opts();

program.parse(process.argv);

if(options.debug) console.log(options);
if(options.version) console.log(currentVersion);

function wordsAction(action, category, word){

  switch(action) {
  case 'add':
    if(word === undefined || category === undefined){
      console.log("requires <word> & <category> to add");
      return;
    }
    addWord(word, category);
    break;
    
  case 'remove':
    if(word === undefined || category === undefined){
      console.log("requires <word> & <category> to remove");
      return;
    }
    removeWord(word, category);    
    break;
  case 'list':
    if(category === undefined) {
      console.log("requires [category] to list all words of that category!");
      return;
    }
    listWords(category);
    break;
  default:
    console.log(`No any action, for ${action}`);
    break;
  }

  syncFile(); // to save the changes
}


function categoryAction(action, category){
  switch(action){
  case 'list':
    listCategories();
    break;
  default:
    console.log("Supported actions - list ");
    break;
  }
}


function testAnything(){
  var fileName = 'places_test.txt';
  var file = fs.readFileSync(fileName);

  var fileContents = file.toLocaleString().toLowerCase().trim();
  var places = fileContents.split('\r\n');
  places.sort((a, b) => {
    if(a.length > b.length) return 1;
    else if(a.length < b.length) return -1;
    return 0;
  });

  for(var place of places){
    addWord(place, "Places");
    // console.log(place);
  }

  // to save the changes
  syncFile();
}



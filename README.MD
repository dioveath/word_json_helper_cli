

# WORD JSON HELPER CLI
Helps with words listing, adding, removing and other utils.

## USAGE
This helps to edit a json data file of words, categories. 
This will be later exported to firestore database.

### Basic Syntax
``` BATCH
node index.js <word|category> <action> [category] [word] 	
```

#### Listing Categories
``` BATCH
node index.js category list 
```

#### Listing Words
``` BATCH
node index.js word list Countries
```

#### Adding Word 
``` BATCH
node index.js word add Countries switzerland
```

#### Removing Word 
``` BATCH
node index.js word remove Countries switzerland
```



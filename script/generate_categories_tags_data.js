#!/usr/bin/env node

const YAML = require('yamljs');
const fs = require('fs');
const path = './_wiki'
const list = [];

getFiles('./_wiki', 'wiki', list);
getFiles('./_posts', 'blog', list);

const dataList = list.map(function collectData(file) {

    const data = fs.readFileSync(file.path, 'utf8');
    return parseInfo(file, data.split('---')[1]);

}).filter(function removeNullData(row) {

    return row != null;

}).sort(function sortByFileName(a, b) {

    return a.fileName.toLowerCase().localeCompare(b.fileName.toLowerCase());

});

/*
Categories:
    - {category: Test1, tags: [test, test2]}
*/
const categoriesTags = { Categories: []};

const tagMap = {};

dataList.forEach(function collectTagMap(data) {
    if(!data.categories) {
        return;
    }
    console.log(data)
    categoryMap = {}
    data.categories.forEach((category) => {
        if (!categoryMap[category]) {
             categoriesTags.Categories.push({
                category: category,
                tags: []
            });

            categoryMap[category] = true
        }

        categoriesTags.Categories.find((item) => item.category === category).tags.push(...data.tags)
        //  categories.Categories[category].push({
        //     fileName: data.fileName,
        //     updated: data.updated || data.date,
        // });
    });
});

categoriesTags.Categories.forEach(item => item.tags.sort())

saveCategoriesTags(categoriesTags);
// saveTagMap(tagMap);
//
//
// const tagList = Object.keys(tagMap).sort(function sortByTagName(a, b) {
//     return a.toLowerCase().localeCompare(b.toLowerCase());
// });
//
// saveTagList(tagList)
//
// const pageMap = {};
// dataList.sort(function(a, b) {
//     return a.modified < b.modified;
// }).forEach(function(page) {
//
//     pageMap[page.fileName] = {
//         type: page.type,
//         title: page.title,
//         summary: page.summary,
//         parent: page.parent,
//         url: page.url,
//         updated: page.updated || page.date,
//     };
//
// });
//
// savePageList(pageMap);

function saveCategoriesTags(categoriesTags) {
    fs.writeFile("./_data/categories-tags.yml", YAML.stringify(categoriesTags), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("categories-tags saved.");
    });
}
//
// function saveTagMap(tagMap) {
//     fs.writeFile("./_data/tags.yml", YAML.stringify(tagMap), function(err) {
//         if(err) {
//             return console.log(err);
//         }
//         console.log("tag saved.");
//     });
// }
//
// function saveTagList(tagList) {
//     fs.writeFile("./_data/tagList.yml", YAML.stringify(tagList), function(err) {
//         if(err) {
//             return console.log(err);
//         }
//         console.log("tagList saved.");
//     });
// }
//
// function savePageList(pageMap) {
//     fs.writeFile("./_data/pageMap.yml", YAML.stringify(pageMap), function(err) {
//         if(err) {
//             return console.log(err);
//         }
//         console.log("pageMap saved.");
//     });
// }
//
function parseInfo(file, info) {
    if(info == null) {
        return undefined;
    }
    const obj = {};
    obj.fileName = file.name.replace(/\.md$/, '');
    obj.type = file.type;

    const rawData = info.split('\n');

    rawData.forEach(function(str) {
        const result = /^\s*([^:]+):\s*(.+)\s*$/.exec(str);

        if(result == null) {
            return;
        }

        const key = result[1].trim();
        const val = result[2].trim();

        obj[key] = val;
    });

    // if(file.type === 'blog') {
    //     obj.url = '/blog/' + obj.date.replace(/^(\d{4})-(\d{2})-(\d{2}).*$/, '$1/$2/$3/');
    //     obj.url += obj.fileName.replace(/^(\d{4}-\d{2}-\d{2}-)?(.*)$/, '$2');
    // } else if(file.type === 'wiki') {
    //     obj.url = '/wiki/' + obj.fileName;
    // }

    if(obj.categories) {
        obj.categories = obj.categories.split(/\s+/);
    }

    if(obj.tags) {
        obj.tags = obj.tags.split(/\s+/);
    }


    const mtime = fs.statSync(file.path).mtime;
    obj.modified = mtime;

    return obj;
}

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}

function isMarkdown(fileName) {
    return /\.md$/.test(fileName);
}

function getFiles(path, type, array){

    fs.readdirSync(path).forEach(function(fileName){

        const subPath = path + '/' + fileName;

        if(isDirectory(subPath)) {
            return getFiles(subPath, type, array);
        }
        if(isMarkdown(fileName)) {
            const obj = {
                'path': path + '/' + fileName,
                'type': type,
                'name': fileName,
            };
            return array.push(obj);
        }
    });
}
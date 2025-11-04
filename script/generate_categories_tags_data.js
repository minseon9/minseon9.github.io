#!/usr/bin/env node

const YAML = require('yamljs');
const fs = require('fs');
const path = './_posts';
const type = 'wiki';
const list = [];

getFiles(path, type, list);

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

const tagMap = new Map();
const categoryMap = new Map();

dataList.forEach(function collectTagMap(data) {
    if(!data.category) {
        return;
    }

    if (!categoryMap.get(data.category)) {
        categoriesTags.Categories.push({
            category: data.category,
            tags: [],
            collection: data.type === 'posts',
        });
        categoryMap.set(data.category, true)
    }

    const category = categoriesTags.Categories.find((item) => item.category === data.category)
    const tags = category.tags
    for (const tag of data.tags) {
        if (tags.includes(tag)) {
            continue;
        }

        category.tags.push(tag)
    }
});

categoriesTags.Categories.forEach(item => item.tags.sort())

saveCategoriesTags(categoriesTags);

function saveCategoriesTags(categoriesTags) {
    fs.writeFile("./_data/categories-tags.yml", YAML.stringify(categoriesTags), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("categories-tags saved.");
    });
}

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

    // obj.url = '/wiki/' + obj.date.replace(/^(\d{4})-(\d{2})-(\d{2}).*$/, '$1/$2/$3/');
    // obj.url += obj.fileName.replace(/^(\d{4}-\d{2}-\d{2}-)?(.*)$/, '$2');


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

const { v4: uuidv4 } = require('uuid');
var createDom = require('./create-dom');
var chromeUtils = require('./chrome-utils');

var ARCHIVE_ID_LIST_KEY = 'archive-id-list';

const saveTabList = (tabList) => {
    // Get the name of the archive from an input?
    var newArchiveName = getNewArchiveName();
    var archive = createArchive(newArchiveName, tabList);
    var numArchives = getArchiveIds().length;
    var isNextEven = numArchives === 0 || numArchives % 2 === 0;
    saveArchive(archive);
    // TODO delete button
    //      Should the delete button say "are you sure" or something?
    //      If I can do the "are you sure" popup I can probably do the "show you a list and let you remove individual items"
    createDom.addArchiveToDom(archive, isNextEven);
}

function createArchive (name, tabList) {
    // Get a list of URLs, removing empty items
    var tabs = tabList
        .map((tab) => {
            var tabUrlAndName = {};
            tabUrlAndName.url = tab.url ? tab.url : '';
            tabUrlAndName.name = tab.title ? tab.title : '';
            return tabUrlAndName;
        })
        .filter((tab) => {
            // Tab names can be empty, but it's unuseable without a url
            return tab.url !== '';
        });
    return {
        id: uuidv4(),
        name: name,
        tabs: tabs
    };
}

function getNewArchiveName () {
    return document.getElementById('archive-name').value;
}

const getArchiveIds = () => {
    var rawIds = localStorage.getItem(ARCHIVE_ID_LIST_KEY);
    return rawIds ? JSON.parse(rawIds) : [];
}

function setArchiveIds(ids) {
    localStorage.setItem(ARCHIVE_ID_LIST_KEY, JSON.stringify(ids));
}

const getArchiveById = (id) => {
    return JSON.parse(localStorage.getItem(id));
}

function saveArchive(archive) {
    localStorage.setItem(archive.id, JSON.stringify(archive));
    addIdToList(archive.id);
}

function addIdToList (id) {
    var ids = getArchiveIds();
    ids.push(id);
    setArchiveIds(ids);
}

exports.saveTabList = saveTabList;
exports.getArchiveById = getArchiveById;
exports.getArchiveIds =getArchiveIds;
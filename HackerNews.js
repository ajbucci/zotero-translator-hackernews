{
	"translatorID": "82f604d7-6c54-482e-b851-a2fb0d855344",
	"label": "HackerNews",
	"creator": "AJ Bucci",
	"target": ".*news\\.ycombinator\\.com\\/item\\?id=.*",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2024-02-24 20:02:41"
}

/*
    ***** BEGIN LICENSE BLOCK *****

    Copyright © 2022 YOUR_NAME <- TODO

    This file is part of Zotero.

    Zotero is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Zotero is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with Zotero. If not, see <http://www.gnu.org/licenses/>.

    ***** END LICENSE BLOCK *****
*/


function detectWeb(doc, url) {
	// TODO: adjust the logic here
	return true;
}

async function doWeb(doc, url) {
	let newItem = new Zotero.Item('webpage');
	newItem.title = doc.title || 'No Title Found';
	newItem.url = url;
	await scrape(doc, url, newItem);
	// Find the first link within the "titleline" span and scrape its content too
	var linkedUrl = doc.querySelector('span.titleline > a').href;
	if (linkedUrl) {
		await scrape(await requestDocument(linkedUrl), linkedUrl, newItem);
	}
	newItem.complete();
}

async function scrape(doc, url, newItem) {
    newItem.attachments.push({
        title: "Snapshot: " + (doc.title || 'No Title Found'),
        document: doc
    });
}
/** BEGIN TEST CASES **/
var testCases = [
]
/** END TEST CASES **/

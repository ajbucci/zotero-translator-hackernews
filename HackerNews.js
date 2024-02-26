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
	if (linkedUrl && linkedUrl != url) {
		await scrape(doc, linkedUrl, newItem);
	}
	newItem.complete();
}

async function scrape(doc, url, newItem) {
	if (url.endsWith('.pdf')) {
		newItem.attachments.push({
			title: "PDF: " + (newItem.title || 'No Title Found'),
			mimeType: "application/pdf",
			url: url
		})
	} else {
		if (url != newItem.url) {
			doc = await requestDocument(url);
		}
		newItem.attachments.push({
			title: "Snapshot: " + (doc.title || 'No Title Found'),
			document: doc
		});
	}
}

/** BEGIN TEST CASES **/
var testCases = [
]
/** END TEST CASES **/

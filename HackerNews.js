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
	"lastUpdated": "2024-02-28 19:06:32"
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
}

async function scrape(doc, url, newItem) {
	if (url.endsWith('.pdf')) {
		newItem.attachments.push({
			title: "PDF: " + (newItem.title || 'No Title Found'),
			mimeType: "application/pdf",
			url: url
		})
		newItem.complete();
	} else {
		if (url != newItem.url) {
			doc = await requestDocument(url);
			// use the linked page to fill out the Author etc.
			var translator = Zotero.loadTranslator('web');
			translator.setHandler('itemDone', function(obj, translatedItem) {
				if (translatedItem.creators && translatedItem.creators.length) {
					newItem.creators.push(translatedItem.creators[0]);
				}
				newItem.date = translatedItem.date;				
				newItem.seeAlso.push(url);
				newItem.complete();
			});
			translator.setHandler('translators', function(obj, translators) {
				if (translators.length) {
					translator.setTranslator(translators);
					translator.translate();
				}
			});
			translator.setDocument(doc);
			translator.getTranslators();
		}
		newItem.attachments.push({
			title: "Snapshot: " + (doc.title || 'No Title Found'),
			document: doc
		});
	}
}
/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://news.ycombinator.com/item?id=39358317",
		"detectedItemType": true,
		"items": [
			{
				"itemType": "webpage",
				"title": "Mastering Programming (2016) | Hacker News",
				"creators": [
					{
						"firstName": "Kent",
						"lastName": "Beck",
						"creatorType": "author"
					}
				],
				"url": "https://news.ycombinator.com/item?id=39358317",
				"attachments": [
					{
						"title": "Snapshot: Mastering Programming (2016) | Hacker News",
						"mimeType": "text/html"
					},
					{
						"title": "Snapshot: Mastering Programming - by Kent Beck",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": [
					"https://tidyfirst.substack.com/p/mastering-programming"
				]
			}
		]
	},
	{
		"type": "web",
		"url": "https://news.ycombinator.com/item?id=39472693",
		"detectedItemType": true,
		"items": [
			{
				"itemType": "webpage",
				"title": "Nobody ever gets credit for fixing problems that never happened (2001) [pdf] | Hacker News",
				"creators": [],
				"url": "https://news.ycombinator.com/item?id=39472693",
				"attachments": [
					{
						"title": "Snapshot: Nobody ever gets credit for fixing problems that never happened (2001) [pdf] | Hacker News",
						"mimeType": "text/html"
					},
					{
						"title": "PDF: Nobody ever gets credit for fixing problems that never happened (2001) [pdf] | Hacker News",
						"mimeType": "application/pdf"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/

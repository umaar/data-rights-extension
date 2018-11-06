
let catalog;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	const url = request.url
	if (url) {
		console.log('We got the URL!!', url);
		// Make this use await getOrganisation();
		const organisation = getOrganisation(url);

		if (organisation) {
			console.log('We found an org!', organisation);
			sendResponse(organisation);
		}
	}
});

async function getCatalog() {
	const lookupRawResponse = await fetch('https://www.datarightsfinder.org/api/1/all');
	const lookupTable = await lookupRawResponse.json();

	const catolog = lookupTable.all_organisations
		.map(org => org.url)
		.map(async function(url) {
			return await (await fetch(url)).json()
		});

	return await Promise.all(catolog);
}

getCatalog().then(response => {
	catalog = response;
	console.log({catalog});
});

function getOrganisation(url) {
	if (!url) {
		console.error('getOrganisation() called without a URL');
		return undefined;
	}

	// Make this use await getCatolog
	let org;

	org = catalog
		.filter(org => org.organisationUrls)
		.filter(org => {
			return new URL(org.organisationUrls[0]).hostname === new URL(url).hostname
		});

	if (org && org.length) return org[0];

	// Sometimes the .organisationUrls property does not exist
	org = catalog
		.filter(org => org.privacyNoticeUrl)
		.filter(org => {
			return new URL(org.privacyNoticeUrl.url).hostname === new URL(url).hostname
		});

	if (org && org.length) return org[0];
}

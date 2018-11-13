chrome.tabs.query({currentWindow: true, active: true}, tabs => {
	const currentTabURL = tabs[0].url;

	chrome.runtime.sendMessage({url: currentTabURL}, org => {
		console.log('the popup received a Message!', {org});

		let emailAddress = '';
		let categoriesList = '';
		let noticeURL = '';
		let orgName = '';

		if (org && org.privacyNoticeUrl && org.privacyNoticeUrl.url) {
			noticeURL = org.privacyNoticeUrl.url;
		}

		if (org && org.organisationInformation && org.organisationInformation.name) {
			orgName = org.organisationInformation.name;
		}

		if (org && org.dataProtectionOfficer && org.dataProtectionOfficer.contactInfo) {
			emailAddress = org.dataProtectionOfficer.contactInfo.emailAddress || '';
		}

		if (org && org.dataCategoriesCollected && org.dataCategoriesCollected.list) {
			categoriesList = org.dataCategoriesCollected.list.map(item => {
				return `
						<li>
							${item.replace(/_/g, ' ')}
						</li>
					`;
			}).join(' ');
		}

		const template = `
				<style>

				body {
				  margin: 5px 10px 10px;
				  width: 520px;
				  font: 17px/1.2 Helvetica, sans-serif;
				}

				#category-list li {
					text-transform: capitalize;
				}

				h1 {
				  color: #53637D;
				  font: 26px/1.2 Helvetica, sans-serif;
				  font-size: 200%;
				  margin: 0;
				  padding-bottom: 4px;
				  text-shadow: white 0 1px 2px;
				}
				</style>

				<div role="main">
					<h1>Access My Data 4000</h1>
				    <p>This organisation holds data about the following:</p>
				    <ul id="category-list">
				    	${categoriesList}
				    </ul>
				    <p>To make a formal request to <span id="org-name">${orgName}</span> for a copy of your personal information:</p>
				    <ul>
				        <li>Send an email to: <span id="org-email">${emailAddress}</span></li>
				    </ul>
				    <p><a target="_blank" href="${noticeURL}" id="privacy-notice-url">Read the privacy notice</a></p>
				</div>
			`;
		document.body.innerHTML = template;
	});
});


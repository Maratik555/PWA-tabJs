window.addEventListener('load', async () => {
	await navigator.serviceWorker.register('sw.js')
	await loadTabs()
})

async function loadTabs() {
	const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=2')
	const data = await res.json()

	const tab = document.querySelector('#tab_1')
	tab.innerHTML = data.map(toCard).join(' ')
}

function toCard(post) {
	return `
<div>
    <div>${post.title}</div>
    <div>${post.body}</div>
</div>  	
	`
}


const tabsBtn = document.querySelectorAll('.tabs__nav-btn')
const tabsItem = document.querySelectorAll('.tabs__item')

tabsBtn.forEach(onTabClick)

function onTabClick(item) {
	item.addEventListener('click', function () {
		let currentBtn = item
		let tabId = currentBtn.getAttribute('data-tab')
		let currentTab = document.querySelector(tabId)

		if (!currentBtn.classList.contains('active'))
			tabsBtn.forEach(function (item) {
				item.classList.remove('active')
			})

		tabsItem.forEach(function (item) {
			item.classList.remove('active')
		})

		currentBtn.classList.add('active')
		currentTab.classList.add('active')
	})
}

document.querySelector('.tabs__nav-btn').click()



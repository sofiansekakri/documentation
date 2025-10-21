console.log('== RECOMMENDATION LIST ==');

mw.loader.using('mediawiki.api').then(() => {
	const PageTypes = Object.freeze({
	    LEVEL:   Symbol("Levels"),
	    ENTITY:  Symbol("Entities"),
	    TALE:    Symbol("Tales"),
	    OBJECT:  Symbol("Objects")
	});
	
	var pages = [];
	
	class PageData {
		constructor(name, rating, type) {
			this.name = name;
			this.rating = rating;
			this.type = type;
		}
		
		getName() {
			return this.name;
		}
		
		getRating() {
			return this.rating;
		}
		
		getType() {
			return this.type;
		}
	}
	
	function act() {
		if (mw.config.get('wgPageName') === "User:Liminalityyyyy/rec-page") {
			
			fetchRatings();
			
			for (var i = 0; i < pages.length; i++) {
				let name = pages[i].getName();
				let rating = pages[i].getRating();
				let type = pages[i].getType();
				
				appendPageOnList(name, rating);
				appendPageOnCategory(name, rating, type);
				appendPageOnGenericCategory(name, rating, type);
			}

		}
	}

	
	function fetchRatings() {
		//mock ratings
		pages[0] = new PageData("Level 0", 2, PageTypes.LEVEL);
		pages[1] = new PageData("Level 3999", -8, PageTypes.LEVEL);
		pages[2] = new PageData("Level 37", 4, PageTypes.LEVEL);
		pages[3] = new PageData("Smilers", 38, PageTypes.ENTITY);
	}
	
	function formatRating(rating) {
		if (rating > 0) {
			return '<span style="color: #a6d85e;">+' + rating + '</span>';
		}
		
		return '<span style="color: #ce0018;">' + rating + '</span>';
	}
	
	function appendPageOnList(name, rating) {
		const listBox = $('.list .list-container');
		
		$(listBox).append('<p><a href="/wiki/"' + name + '" title="' + name + '">' + name + '</a> |' + formatRating(rating) + '</p>');
	}
	
	function clonePageBox(name, rating) {
		const templateBox = $('.template .page-box');
		const clonedBox = templateBox.clone(true);
		
		$(clonedBox).find('.title').append(formatRating(rating));
		$(clonedBox).find('.text-content').find('p').text(name);
		
		return clonedBox;
	}
	
	function appendPageOnCategory(name, rating, type) {
		const curType = type.description;
		$('#' + curType).append(clonePageBox(name, rating));
	}
	
	function appendPageOnGenericCategory(name, rating) {
		$('#All').append(clonePageBox(name, rating));
	}
	
	act();
	
})

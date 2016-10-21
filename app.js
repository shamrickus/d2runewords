angular.module("mainApp", [])
.controller('sortController', ['$scope', function($scope){
	$scope.sortName = 'name';
	$scope.sortReverse = false;
	$scope.items = data;
	$scope.initRunes = {
		"El": 
			{
				lvl: 11
			},
		"Eld": 
			{
				lvl: 11
			},
		"Tir": 
			{
				lvl: 13
			},
		"Nef": 
			{
				lvl: 13
			},
		"Eth": 
			{
				lvl: 15
			},
		"Ith": 
			{
				lvl: 15
			},
		"Tal": 
			{
				lvl: 17
			},
		"Ral": 
			{
				lvl: 19
			},
		"Ort": 
			{
				lvl: 21
			},
		"Thul": 
			{
				lvl: 23
			},
		"Amn": 
			{
				lvl: 25
			},
		"Sol": 
			{
				lvl: 27
			},
		"Shael": 
			{
				lvl: 29
			},
		"Dol": 
			{
				lvl: 31
			},
		"Hel": 
			{
				lvl: 33
			},
		"Io": 
			{
				lvl: 35
			},
		"Lum": 
			{
				lvl: 37
			},
		"Ko": 
			{
				lvl: 39
			},
		"Fal": 
			{
				lvl: 41
			},
		"Lem": 
			{
				lvl: 43
			},
		"Pul": 
			{
				lvl: 45
			},
		"Um": 
			{
				lvl: 47
			},
		"Mal": 
			{
				lvl: 49
			},
		"Ist": 
			{
				lvl: 51
			},
		"Gul": 
			{
				lvl: 53
			},
		"Vex": 
			{
				lvl: 55
			},
		"Ohm": 
			{
				lvl: 57
			},
		"Lo": 
			{
				lvl: 59
			},
		"Sur": 
			{
				lvl: 61
			},
		"Ber": 
			{
				lvl: 63
			},
		"Jah": 
			{
				lvl: 65
			},
		"Cham": 
			{
				lvl: 67
			},
		"Zod": 
			{
				lvl: 69
			}
	};
	$scope.math = {
		'<': function(x, y) { return x < y },
		'<=': function(x , y) { return x <= y},
		'>': function(x, y) { return x > y},
		'>=': function(x, y) { return x >= y}
	}
	$scope.itemTypes = [];

	/*Model:
		type:
		parentCats:
		maxSockets:
		tags:
	*/
/*	$scope.weaponTags1h = ["1 Handed", "One Handed", "1h", "1handed"]
	$scope.weaponTags2h = ["2 Handed", "Two Handed", "2h", "1handed"]
	$scope.itemTypeCategories = ["Maces", "Weapons", "Melee Weapons", "Missle Weapons", "Helms", "Body Armor", "Shields"];
	$scope.itemTypeModel = [{
		type: "Axes",
		parentCats: ["Weapons", "Melee Weapons"],
		maxSockets: 6,
		tags: ["Axes"].concat($scope.weaponTags1h, $scope.weaponTags2h, this.parentCats)
	},
	{
		type: "Swords",
		parentCats: ["Weapons", "Melee Weapons"],
		maxSockets: 6,
		tags: ["Swords"].concat($scope.weaponTags1h, $scope.weaponTags2h, this.parentCats)
	},
	{
		type: "Scepters",
		parentCats: ["Weapons", "Melee Weapons"],
		maxSockets: 5,
		tags: ["Scepters"].concat($scope.weaponTags1h this.parentCats)
	},
	{
		type: "Clubs",
		parentCats: ["Weapons", "Melee Weapons", "Maces"],
		maxSockets: 6,
		tags: ["Clubs"].concat($scope.weaponTags1h, $scope.weaponTags2h, this.parentCats)
	},
	{
		type: "Maces",
		parentCats: ["Weapons", "Melee Weapons", "Maces"],
		maxSockets: 3,
		tags: ["Maces"].concat($scope.weaponTags1h, this.parentCats)
	},
	{
		type: "Hammers",
		parentCats: ["Weapons", "Melee Weapons", "Maces"],
		maxSockets: 4,
		tags: ["Hammers"].concat($scope.weaponTags1h, this.parentCats)
	},
	{
		type: "Claws",
		parentCats: ["Weapons", "Melee Weapons", "Katar", "Assassin"],
		maxSockets: 3,
		tags: ["Claws"].concat($scope.weaponTags1h, this.parentCats)
	},
	{
		type: "Polearms",
		parentCats: ["Weapons", "Melee Weapons"],
		maxSockets: 6,
		tags: ["Polearms"].concat($scope.weaponTags2h, this.parentCats)
	},
	{
		type: "Staves",
		parentCats: ["Weapons", "Melee Weapons"],
		maxSockets: 6,
		tags: ["Staves", "Staff"].concat($scope.weaponTags1h, $scope.waeponTags2h, this.parentCats)
	}]*/

	$scope.substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;

	    // an array that will be populated with substring matches
	    matches = [];

	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i');

	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(strs, function(i, str) {
	      if (substrRegex.test(str)) {
	        matches.push(str);
	      }
	    });

	    cb(matches);
	  };
	};

	$scope.initItems = function(){
		let types = [];
		for(var i = 0; i < $scope.items.length; ++i){
			let item = $scope.items[i];
			item.lvlReq = $scope.getLvlReq(item.runes);
			types = types.concat(item.itemType.replace(/\([A-Za-z0-9\s]+\)/g, "").split("/"));
			$scope.items[i].itemType = item.itemType.replace(/\//g, "\n");
		}
		$scope.itemTypes = types.filter($scope.onlyUnique)

		$("[placeholder='Runes']:not('.bound')").change(function(){
			$scope.$apply();
		}).addClass("bound");

		$("[data-toggle='tooltip']:not('.bound')").each(function(){
			$(this).tooltip();
		}).addClass("bound");

		$.each($scope.itemTypes, function(key, value) {
		$("#itemSelect")
			.append($("<option></option>")
				.attr("value", value)
				.text(value));
		});

		$("#runes").tagsinput({
			confirmKeys: [13, 188, 32],
			typeaheadjs: {
				hint: true,
				highlight: true,
				source: $scope.substringMatcher(Object.keys($scope.initRunes))
			}
		});

		$("#versionHolder").text("Version " + $("#version").text());
	}

	$scope.outputRune = function(runes){
		let runeStr = "";
		
		for(var i = 0; i < runes.length; ++i){
			let rune = runes[i];
			if(i == runes.length - 1){
				runeStr+= rune;
			}
			else{
				runeStr+= rune + " + ";
			}
		}

		return runeStr;
	}

	$scope.onlyUnique = function(value, index, self) {
		return self.indexOf(value) === index;
	}

	$scope.getLvlReq = function(runes){
		let minLvl = 11;

		for(var i = 0; i < runes.length; ++i){
			let rune = runes[i];
			let lvlReq = $scope.initRunes[rune].lvl;
			if(lvlReq > minLvl) minLvl = lvlReq;
		}

		return minLvl;
	}

	$scope.getItemName = function(item){
		if(item.classRestriction != null){
			return item.name + " (" + item.classRestriction + ")";
		}
		else{
			return item.name;
		}
	}

	$scope.checkFilters = function(testItem){
		let name = testItem.name != undefined ? testItem.name.toLowerCase() : "";
		let testName = $scope.name != undefined ? $scope.name.toLowerCase() : "";
		if(!name.includes(testName)) return false;

		let sockets = testItem.sockets != undefined ? testItem.sockets : "";
		let testSockets = $scope.sockets != undefined ? $scope.sockets : "";
		if(testSockets != "" && sockets != testSockets) return false;

		let type = testItem.itemType != undefined ? testItem.itemType.toLowerCase() : "";
		let testType = $scope.itemType != undefined ? $scope.itemType.map(function(x){ return x.toLowerCase();}) : [];
		let typeFound = false;
		for(var i = 0; i < testType.length; ++i){
			let itemType = testType[i];
			if(type.includes(itemType)){
				typeFound = true;
				break;
			}
		}
		if(!typeFound && testType.length != 0) return false;

		$scope.runes = $("#runes").val() != undefined ? $("#runes").val().toLowerCase().split(",") : $scope.initRunes;
		let runes = testItem.runes.map(function(x){ return x.toLowerCase();});
		for(var i = 0; i < $scope.runes.length; ++i){
			let rune = $scope.runes[i];
			if(rune === "") continue;
			if(runes.indexOf(rune) == -1) return false;
		}

		let lvl = testItem.lvlReq.toString();
		let testLvl = $scope.lvlReq != undefined ? $scope.lvlReq : "";

		let mathRegex = new RegExp(/(((\<\=|\<)\s[0-9]+)|((\>\=|\>)\s[0-9]+))/);
		if(testLvl != ""){
			if(mathRegex.test(testLvl)){
				var data = testLvl.split(" ");
				if(!$scope.math[data[0]](lvl, data[1])) return false;
			}
			else if(!lvl.includes(testLvl)) return false;
		}


		let properties = testItem.properties.map(function(val){return val.toLowerCase();});
		let testProps = $scope.properties != undefined ? $scope.properties.toLowerCase() : "";
		let propFound = true;
		if(testProps != ""){
			propFound = false;
			for(var i = 0; i < properties.length; ++i){
				let property = properties[i];
				if(property.includes(testProps)){
					propFound = true;
					break;
				}
			}
		}
		return propFound;
	}
}]);	
angular.module("mainApp", [])
.controller('sortController', ['$scope', function($scope){
	$scope.sortName = 'name';
	$scope.sortReverse = false;
	$scope.items = data;
	$scope.initRunes = {
		"El": { lvl: 11 },
		"Eld": { lvl: 11 },
		"Tir": { lvl: 13 },
		"Nef": { lvl: 13 },
		"Eth": { lvl: 15 },
		"Ith": { lvl: 15 },
		"Tal": { lvl: 17 },
		"Ral": { lvl: 19 },
		"Ort": { lvl: 21 },
		"Thul": { lvl: 23 },
		"Amn": { lvl: 25 },
		"Sol": { lvl: 27 },
		"Shael": { lvl: 29 },
		"Dol": { lvl: 31 },
		"Hel": { lvl: 33 },
		"Io": { lvl: 35 },
		"Lum": { lvl: 37 },
		"Ko": { lvl: 39 },
		"Fal": { lvl: 41 },
		"Lem": { lvl: 43 },
		"Pul": { lvl: 45 },
		"Um": { lvl: 47 },
		"Mal": { lvl: 49 },
		"Ist": { lvl: 51 },
		"Gul": { lvl: 53 },
		"Vex": { lvl: 55 },
		"Ohm": { lvl: 57 },
		"Lo": { lvl: 59 },
		"Sur": { lvl: 61 },
		"Ber": { lvl: 63 },
		"Jah": { lvl: 65 },
		"Cham": { lvl: 67 },
		"Zod": { lvl: 69 }
	};
	$scope.testRunes = [];
	$scope.math = {
		'<': function(x, y) { return x < y },
		'<=': function(x , y) { return x <= y},
		'>': function(x, y) { return x > y},
		'>=': function(x, y) { return x >= y}
	}
	$scope.itemTypes = [];
	$scope.oldItemTypes = [];
	$scope.runesStrict = false;
	$scope.includeLadder = true;
	$scope.version = {orig: true, ot: true, oe: true};
	$scope.mathRegex = new RegExp(/(((\<\=|\<)\s[0-9]+)|((\>\=|\>)\s[0-9]+))/);


	$scope.substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches;

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
		$scope.itemTypes = types.filter($scope.onlyUnique).sort(function(a, b) {
			return a.localeCompare(b);
		});

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

		try {
			$.material.init();
			$("#itemSelect").selectpicker();
		}
		catch {
			//For unit testing
		}
	}

	$scope.updateItemType = function(e) {
		let newTypes = $scope.itemType.filter(x => !$scope.oldItemTypes.includes(x));
		$scope.oldItemTypes = $scope.itemType.slice(0);

		for(let i = 0; i < newTypes.length; ++i) {
			let types = itemTypeParents.filter(x => x.name === newTypes[i]);
			if (types.length > 0) {
				let type = types[0];
				$("#itemSelect option").each(function() {
					let val = $(this).val();
					let index = type.parents.indexOf(val);
					if(index > -1) {
						let vals = $scope.itemType;
						vals.push(val);
						$("#itemSelect").selectpicker('val', vals);
					}
				});
			}
		}
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

	$scope.sort = function(column) {
		if ($scope.sortName == column) $scope.sortReverse = !$scope.sortReverse;
		else {
			$scope.sortName = column;
			$scope.sortReverse = false;
		}
	}

	$scope.handleName = function(testItem) {
		let name = testItem.name != undefined ? testItem.name.toLowerCase() : "";
		let testName = $scope.name != undefined ? $scope.name.toLowerCase() : "";
		if(!name.includes(testName)) return false;
	}

	$scope.handleSockets = function(testItem) {
		let sockets = testItem.sockets.toString();
		let testSockets = $scope.sockets != undefined ? $scope.sockets.toString() : "";

		if (testSockets != "") {
			if ($scope.mathRegex.test(testSockets)) {
				var data = testSockets.split(" ");
				if (!$scope.math[data[0]](sockets, data[1])) return false;
			}
			else if (!sockets.includes(testSockets)) return false;
		}
	}

	$scope.handleType = function (testItem) {
		let type = testItem.itemType != undefined ? testItem.itemType.toLowerCase() : "";
		let testType = $scope.itemType != undefined ? $scope.itemType.map(function(x){ return x.toLowerCase();}) : [];
		let typeFound = false;
		for(var i = 0; i < testType.length; ++i){
			let itemType = testType[i];
			if(type.includes(itemType)){
			    if(itemType != "weapons" || (itemType == "weapons" && type == itemType)) {
					typeFound = true;
					break;
				}
			}
		}
		if(!typeFound && testType.length != 0) return false;
	}

	$scope.handleRunes = function(testItem) {
		//$scope.testRunes is the default option for testing, should never happen in production
		$scope.runes = $("#runes").val() != undefined ? $("#runes").val().toLowerCase().split(",") : $scope.testRunes.map(function(x){ return x.toLowerCase();});
		while($scope.runes[$scope.runes.length - 1] == "") $scope.runes.splice($scope.runes.length - 1, 1);
		if($scope.runes.length == 0) return true;

		let runes = testItem.runes.map(function(x){ return x.toLowerCase();});
		if ($scope.runesStrict) {
			for(var i = 0; i < $scope.runes.length; ++i){
				let rune = $scope.runes[i];
				if(rune === "") continue;
				if(runes.indexOf(rune) == -1) return false;
			}
		}
		else {
			for(var i = 0; i < runes.length; ++i) {
				let rune = runes[i];
				if(rune === "") continue;
				if($scope.runes.indexOf(rune) > -1) return true;
			}
			return false;
		}
	}

	$scope.handleLvl = function (testItem) {
		let lvl = testItem.lvlReq.toString();
		let testLvl = $scope.lvlReq != undefined ? $scope.lvlReq : "";

		if(testLvl != ""){
			if($scope.mathRegex.test(testLvl)){
				var data = testLvl.split(" ");
				if(!$scope.math[data[0]](lvl, data[1])) return false;
			}
			else if(!lvl.includes(testLvl)) return false;
		}
	}

	$scope.handleVersion = function(testItem) {
		let version = testItem.version.toString();
		let testVersion = [];
		if($scope.version.orig) testVersion.push("1.09");
		if($scope.version.ot) testVersion.push("1.1");
		if($scope.version.oe) testVersion.push("1.11");
		if(testVersion.indexOf(version) == -1) return false;
	}

	$scope.handleLadder = function(testItem) {
		let ladder = testItem.ladder;
		let testLadder = $scope.includeLadder;
		if(testLadder == false && ladder == true) return false;
	}

	$scope.handleProp = function (testItem) {
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

	$scope.checkFilters = function(testItem){
		results = [];
		results.push($scope.handleName(testItem));
		results.push($scope.handleSockets(testItem));
		results.push($scope.handleType(testItem));
		results.push($scope.handleRunes(testItem));
		results.push($scope.handleLvl(testItem));
		results.push($scope.handleVersion(testItem));
		results.push($scope.handleLadder(testItem));
		results.push($scope.handleProp(testItem));

		if(results.indexOf(false) > -1) return false;
		else return true;
	}
}]);

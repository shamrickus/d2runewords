angular.module("mainApp", [])
.controller('sortController', ['$scope', function($scope){
	$scope.sortName = 'name';
	$scope.sortReverse = false;
	$scope.items = data;
	$scope.runes = {
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

	$scope.initItems = function(){
		for(var i = 0; i < $scope.items.length; ++i){
			let item = $scope.items[i];
			item.lvlReq = $scope.getLvlReq(item.runes);
		}
		$("[placeholder='Runes']:not('bound')").change(function(){
			$scope.$apply();
		}).addClass("bound");

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

	$scope.getLvlReq = function(runes){
		let minLvl = 11;

		for(var i = 0; i < runes.length; ++i){
			let rune = runes[i];
			let lvlReq = $scope.runes[rune].lvl;
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
		let testType = $scope.itemType != undefined ? $scope.itemType.toLowerCase() : "";
		if(!type.includes(testType)) return false;

		$scope.runes = $("#runes").val().toLowerCase().split(",");
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
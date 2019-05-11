describe("sortController", function() {
	beforeEach(module("mainApp"));

	var $controller;

	function sort(a, b, property, elseFunc){
		if(a[property] < b[property]) return -1;
		else if(a[property] > b[property]) return 1;
		else if(elseFunc != null){
			return elseFunc(a, b);
		}
		else{
			return 0;
		}
	}

	function alphabeticSort(a, b){
		return sort(a, b, "name");
	}

	function alphabeticSortReverse(a, b){
		return alphabeticSort(a, b) * -1;
	}

	function socketsSort(a, b){
		return sort(a, b, "sockets");
	}

	function socketsSortReverse(a, b){
		return sort(a, b, "sockets") * -1;
	}

	function itemTypeSort(a, b){
		return sort(a, b, "itemType");
	}

	function itemTypeSortReverse(a, b){
		return itemTypeSort(a, b) * -1;
	}

	function lvlReqSort(a, b){
		return sort(a, b, "lvlReq");
	}

	function lvlReqSortReverse(a, b){
		return lvlReqSort(a, b) * -1;
	}

	function applyFilter($scope) {
		let retArr = [];
		for(var i = 0; i < $scope.items.length; ++i){
			if($scope.checkFilters($scope.items[i])) retArr.push($scope.items[i]);
		}

		return retArr;
	}

	beforeEach(inject(function(_$controller_, _$filter_) {
		$controller = _$controller_;
		$filter = _$filter_;

		$scope = {};
		filter = $filter('orderBy');
		controller = $controller('sortController', { $scope: $scope });

		$scope.initItems();
	}));

	describe("tests", function() {
		it("initial item test", function() {
			expect($scope.items.length).toEqual(81);
		});

		it("initRune test", function () {
			expect(Object.keys($scope.initRunes).length).toEqual(33);
		});

		it("outputRune test", function () {
			expect($scope.outputRune(["Mal", "Tal", "Ral"])).toEqual("Mal + Tal + Ral");

		});

		it("getLvlReq test", function() {
			let runes = ["El", "Thul", "Zod"];

			expect($scope.getLvlReq(runes)).toEqual(69);
		});

		it("getItemName test", function() {
			let item = {
				name: "test"
			};

			expect($scope.getItemName(item)).toEqual(item.name);

			item.classRestriction = "restr";

			expect($scope.getItemName(item)).toEqual(item.name + " (" + item.classRestriction + ")");
		});

		describe("orderBy tests", function(){
			it("sort by name", function(){
				var orderedItems = filter($scope.items, $scope.sortName, false);

				var sortedItems = $scope.items.sort(alphabeticSort);

				expect(orderedItems.length-sortedItems.length).toEqual(0);
				for(let i = 0; i < orderedItems.length; ++i) {
					if((orderedItems[i].name === "Spirit" || orderedItems[i].name === "Phoenix" || orderedItems[i].name === "Fortitude") && orderedItems[i].name === sortedItems[i].name)
						continue;
				    expect(orderedItems[i]).toEqual(sortedItems[i]);
				}
			});

			it("sort by name reverse", function(){
				var orderedItems = filter($scope.items, $scope.sortName, true);

				var sortedItems = $scope.items.sort(alphabeticSortReverse);

				expect(orderedItems.length-sortedItems.length).toEqual(0);
				for(let i = 0; i < orderedItems.length; ++i) {
					if((orderedItems[i].name === "Spirit" || orderedItems[i].name === "Phoenix" || orderedItems[i].name === "Fortitude") && orderedItems[i].name === sortedItems[i].name)
						continue;
					expect(orderedItems[i]).toEqual(sortedItems[i]);
				}
			});

			it("sort by sockets", function(){
				var orderedItems = filter($scope.items, "sockets", false);

				var sortedItems = $scope.items.sort(socketsSort);

				expect(orderedItems.length).toEqual(sortedItems.length);

				//we only care if the sockets are sorted
				for(var i = 0; i < orderedItems.length; ++i) {
					expect(orderedItems[i].sockets).toEqual(sortedItems[i].sockets);
				}
			});

			it("sort by sockets reverse", function(){
				var orderedItems = filter($scope.items, "sockets", true);

				var sortedItems = $scope.items.sort(socketsSortReverse);

				expect(orderedItems.length).toEqual(sortedItems.length);

				//we only care if the sockets are sorted
				for(var i = 0; i < orderedItems.length; ++i) {
					expect(orderedItems[i].sockets).toEqual(sortedItems[i].sockets);
				}
			});

			it("sort by item type", function(){
				var orderedItems = filter($scope.items, "itemType", false);

				var sortedItems = $scope.items.sort(itemTypeSort);

				expect(orderedItems.length).toEqual(sortedItems.length);

				//we only care if the itemType.length;
				for(var i = 0; i < orderedItems.length; ++i) {
					expect(orderedItems[i].itemType).toEqual(sortedItems[i].itemType);
				}
			});

			it("sort by item type", function(){
				var orderedItems = filter($scope.items, "itemType", true);

				var sortedItems = $scope.items.sort(itemTypeSortReverse);

				expect(orderedItems.length).toEqual(sortedItems.length);

				//we only care if the itemType.length;
				for(var i = 0; i < orderedItems.length; ++i) {
					expect(orderedItems[i].itemType).toEqual(sortedItems[i].itemType);
				}
			});

			it("sort by lvl req", function(){
				var orderedItems = filter($scope.items, "lvlReq", false);

				var sortedItems = $scope.items.sort(lvlReqSort);

				expect(orderedItems.length).toEqual(sortedItems.length);

				//we only care if the lvlReq.length;
				for(var i = 0; i < orderedItems.length; ++i) {
					expect(orderedItems[i].lvlReq).toEqual(sortedItems[i].lvlReq);
				}
			});

			it("sort by lvl req", function(){
				var orderedItems = filter($scope.items, "lvlReq", true);

				var sortedItems = $scope.items.sort(lvlReqSortReverse);

				expect(orderedItems.length).toEqual(sortedItems.length);

				//we only care if the lvlReq.length;
				for(var i = 0; i < orderedItems.length; ++i) {
					expect(orderedItems[i].lvlReq).toEqual(sortedItems[i].lvlReq);
				}
			});
		});

		describe("checkFilters tests", function(){
			it("name filter", function(){
				$scope.name = "SP";

				let results = applyFilter($scope);

				expect(results.length).toEqual(3);
			});

			it("sockets filter", function(){
				$scope.sockets = 3;

				let results = applyFilter($scope);

				expect(results.length).toEqual(28);

				$scope.sockets = "< 3";
				results = applyFilter($scope);
				expect(results.length).toEqual(13);

				$scope.sockets = "<= 3";
				results = applyFilter($scope);
				expect(results.length).toEqual(41);

				$scope.sockets = "> 3";
				results = applyFilter($scope);
				expect(results.length).toEqual(40);

				$scope.sockets = ">= 3";
				results = applyFilter($scope);
				expect(results.length).toEqual(68);
			});

			it("item type filter", function(){
				$scope.itemType = ["Weapon"];

				let results = applyFilter($scope);

				expect(results.length).toEqual(22);
			});

			it("strict rune filter", function(){
				$scope.runesStrict = true;
				$scope.testRunes = ["Zod"];

				let results = applyFilter($scope);

				expect(results.length).toEqual(1);

				$scope.testRunes = ["Zod", "Ber"];

				results = applyFilter($scope);

				expect(results.length).toEqual(0);
			});

			it("rune filter", function(){
				$scope.runesStrict = false;
				$scope.testRunes = ["Zod", "Vex"];

				let results = applyFilter($scope);

				expect(results.length).toEqual(8);
			});

			it("lvl req filter", function(){
				$scope.lvlReq = 3;

				let results = applyFilter($scope);

				expect(results.length).toEqual(23);

				$scope.lvlReq = 25;

				results = applyFilter($scope);

				expect(results.length).toEqual(5);

				$scope.lvlReq = "< 37";

				results = applyFilter($scope);

				expect(results.length).toEqual(22);

				$scope.lvlReq = "<= 37";

				results = applyFilter($scope);

				expect(results.length).toEqual(25);

				$scope.lvlReq = "> 37";

				results = applyFilter($scope);

				expect(results.length).toEqual(56);

				$scope.lvlReq = ">= 37";

				results = applyFilter($scope);

				expect(results.length).toEqual(59);
			});

			it("properties filter", function() {
				$scope.properties = "attack";

				let results = applyFilter($scope);

				expect(results.length).toEqual(40);
			})
		});
	});
});


coolApp.controller('fruitCtrl', function($scope, $location, $window, $routeParams, $templateRequest, $compile, fruitService, cartService, AuthService, mySharedService, myModal) {

    $scope.showFruit = false;
    $scope.headerText = 'hi fruit';
    $scope.loaded = false;
    $scope.fruits = [];
    $scope.categoryId = 0;
  //  var categoryId = categoriesConfig[$routeParams.name];

    fruitService.getCategories($scope, function(res) {
        $scope.categories = res.data;
        for(let i=0; i< $scope.categories.length; i++){
            if($scope.categories[i]['url'] == $routeParams.name){
                $scope.categoryId = $scope.categories[i]['id'];
                break;
            }
        };

        fruitService.getFruits($scope.categoryId, function(res) {
            $scope.fruits = res.data;
            $scope.categoryName = $routeParams.name;
            $scope.loaded = true;
        }, function(res) {});

    }, function(res) {});
    
    var getFruit = function (id) {
        $scope.fruit = $scope.fruits.filter(function(fruit){
            return fruit.id == id;
        })[0];
        $scope.showFruit = true;
    };

    $scope.goToFruit = function (categoryName, id) {
        getFruit(id);
        $location.path('admin/category/' + categoryName + '/' + id, false);
    };

    $scope.showFruitPopup = function (categoryName, id) {
        var fruits = document.querySelectorAll('.fruit-item');
        [].forEach.call(fruits, function(fruits) {
            fruits.classList.remove('current-fruit');
        });
        document.querySelector('#fruit-'+id).classList.add('current-fruit');
        showModal();
    };


    $scope.$watch('loaded', function(newVal, oldVal, $scope) {
        if($scope.loaded && $routeParams && $routeParams.id){
            getFruit($routeParams.id);
        }
    });

    $scope.addToCart = function (id, count, price, name) {
        cartService.addToCart(id, count, price, name, function(res) {
            mySharedService.addFruit(res.data);
        }, function(res) {});
    };

    $scope.editFruit = function(){
        $scope.fruitEdited = angular.copy($scope.fruit);
        $templateRequest("fruits/admin.fruits.form.html").then(function(html){
            var template = angular.element(html);
            angular.element(document.querySelector('.container')).empty().append(template);
            $compile(template)($scope);
        });
    };

    $scope.addFruit = function(){
         $scope.fruitAdded = {};
        $scope.fruitAdded.category = $scope.categoryId;
        $templateRequest("fruits/admin.fruits.add.html").then(function(html){
            var template = angular.element(html);
            angular.element(document.querySelector('.container')).empty().append(template);
            $compile(template)($scope);
        });
    };

    $scope.saveFruitData = function(){
        $scope.fruitEdited.category = document.querySelector('#fruitCategory').value;
        return fruitService.saveFruit($scope.fruitEdited, function(res) {
            if(res.data.error){
                if(res.data.errorCode == 2){
                    alert(res.data.error);
                    $window.location.href = '/';
                } else {
                    alert('SAVING ERROR');
                }
            } else {
                let action = 'edit';
                if($scope.categoryId != +$scope.fruitEdited.category){ // CATEGORY CHANGED
                    action = 'move';
                }
                for(let i=0; i<$scope.fruits.length; i++){
                    if($scope.fruits[i]['id'] == $scope.fruitEdited.id){
                        $scope.fruit = $scope.fruitEdited;
                        if(action=='edit'){
                            $scope.fruits[i] = $scope.fruitEdited;
                        } else {
                            $scope.fruits.splice(i, 1);
                        }
                        break;
                    }
                }
                $scope.closeForm();
            }
        }, function(err) {
            alert('saving error');
        });
    }

    $scope.saveFruit = function(){
        var f = document.getElementById('file').files[0];
        if(f){
            $scope.uploadFile(f);
        } else{
            $scope.saveFruitData();
        }
    };

    $scope.uploadFile = function(f){
        var fd = new FormData();
        fd.append('image', f);
        fruitService.uploadImage(fd, function(res) {
            if(res.data.image){
                $scope.fruitEdited.image = res.data.image;
            }
            $scope.saveFruitData();
        }, function(err) {});
    };

    $scope.saveAddingFruit = function(){
        fruitService.addFruit($scope.fruitAdded, function(res) {
            if(res.data.error ){
                if(res.data.errorCode == 1){
                    alert(res.data.error);
                    $window.location.href = '/';
                } else {
                    alert('ADDING ERROR');
                }
            } else {
                $scope.fruitAdded.id= res.data.id;
                if($scope.categoryId == +$scope.fruitAdded.category){
                    $scope.fruits.push($scope.fruitAdded);
                }
                $scope.fruit = $scope.fruitAdded;
                $scope.closeForm();
            }
        }, function(err) {alert('saving error')});
    }

    $scope.saveAddFruit = function(){
        var f = document.getElementById('AddFile').files[0];
        if(f){
            $scope.uploadAddFile(f);
        } else{
            $scope.saveAddingFruit();
        }
    };

    $scope.uploadAddFile = function(f){
        var fd = new FormData();
        fd.append('image', f);
        fruitService.uploadImage(fd, function(res) {
            if(res.data.image){
                $scope.fruitAdded.image = res.data.image;
            }
            $scope.saveAddingFruit();
        }, function(err) {});
    };

    $scope.closeForm = function(){
        $templateRequest("fruits/admin.fruits.preview.html").then(function(html){
            var template = angular.element(html);
            angular.element(document.querySelector('.container')).empty().append(template);
            $compile(template)($scope);
        });
    }
    var showModal = myModal.activate;

    var element = document.getElementById('element');
    var resultFruit = document.getElementById('resultFruit');
    var resizer = document.createElement('div');
    resizer.className = 'resizer';
    resizer.style.width = '7px';
    resizer.style.height = '100%';
    resizer.style.background = '#04A3ED';
    resizer.style.position = 'absolute';
    resizer.style.right = 0;
    resizer.style.bottom = 0;
    resizer.style.cursor = 'ew-resize';
    element.appendChild(resizer);
    resizer.addEventListener('mousedown', initResize, false);

    function initResize(e) {
        window.addEventListener('mousemove', Resize, false);
        window.addEventListener('mouseup', stopResize, false);
    }
    function Resize(e) {
        element.style.width = (e.clientX - element.offsetLeft) + 'px';
        resultFruit.style.width = 1320 - e.clientX + 'px';
    }
    function stopResize(e) {
        window.removeEventListener('mousemove', Resize, false);
        window.removeEventListener('mouseup', stopResize, false);
    }


});

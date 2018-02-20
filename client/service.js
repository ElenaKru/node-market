
coolApp.service('fruitService', function($http) {
    this.getFruits = function(categoryId, onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/category',
            method: 'GET',
            params: {category: categoryId}
        }).then(onSuccess, onError);
    }

    this.saveFruit = function(fruit, onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/fruit/edit',
            method: 'POST',
            data: fruit
        }).then(onSuccess, onError);
    }

    this.uploadImage = function(fd, onSuccess, onError){
        $http({
            url: 'http://localhost:8081/fruit/image',
            method: 'POST',
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity

        }).then(onSuccess, onError);
    };
    this.addFruit = function(fruit, onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/fruit/add',
            method: 'POST',
            params: {
                id: fruit.id,
                name: fruit.name,
                category: fruit.category,
                price: fruit.price
            }
        }).then(onSuccess, onError);
    }

    this.getCategories = function(category, onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/categories',
            method: 'GET',
            params: {
                id: category.id,
                name: category.name
            }
        }).then(onSuccess, onError);
    }
});
/* SHARE DATA BETWEEN CONTROLLERS */
coolApp.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    sharedService.fruit = {};
    sharedService.addFruit = function(fruit) {
        this.fruit = fruit;
        this.addingFruitItem();
    };
    sharedService.addingFruitItem = function() {
        $rootScope.$broadcast('handleFruitAdding');
    };
    return sharedService;
});



coolApp.service('AuthService',  function($http) {
    this.checkLoggedIn = function (onSuccess, onError){
        $http({
            url: 'http://localhost:8081/logged_in',
            method: 'GET'
        }).then(onSuccess, onError);
    };

        this.login = function (email, password, onSuccess, onError) {
            $http({
                url: 'http://localhost:8081/login',
                method: 'POST',
                params: {email: email, password:password}
            }).then(onSuccess, onError);
        };
    this.logout = function (onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/logout',
            method: 'POST',
            params: {}
        }).then(onSuccess, onError);
    };

    this.register = function (user,onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/register',
            method: 'POST',
            params: {
                    teudat_zehut: user.teudat_zehut,
                    name: user.name,
                    last_name: user.last_name,
                    email: user.email,
                    password: user.password,
                    city: user.city,
                    street: user.street,
                    role: user.role
            }
        }).then(onSuccess, onError);
    };


    });

coolApp.service('cartService', function($http) {
    this.addToCart = function(fruitId, fruitCount, fruitPrice, fruitName, onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/cart/add',
            method: 'POST',
            params: {
                product: fruitId,
                quantity: fruitCount,
                price: fruitPrice,
                name: fruitName
            }
        }).then(onSuccess, onError);
    }

    this.deleteFromCart = function(itemId, onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/cart/delete',
            method: 'POST',
            params: {
                id: itemId
            }
        }).then(onSuccess, onError);
    }

    this.getCart = function(onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/cart/get',
            method: 'GET',
            params: {}
        }).then(onSuccess, onError);
    }

});

coolApp.service('orderService', function($http) {
    this.makeOrder = function(order, onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/order',
            method: 'POST',
            params: {
                id: order.id,
                customer: order.customer,
                cart: order.cart,
                price: order.price,
                delivery_city: order.delivery_city,
                delivery_street: order.delivery_street,
                delivery_date: order.delivery_date,
                order_date: order.order_date,
                credit_card: order.credit_card
            }
        }).then(onSuccess, onError);
    }
});

coolApp.factory('myModal', function (btfModal) {
    return btfModal({
        controller: 'MyModalCtrl',
        controllerAs: 'modal',
        templateUrl: 'modal.html'
    });
});

coolApp.controller('MyModalCtrl', function (myModal) {
    let fruit = document.querySelector('.current-fruit');
    this.fruitId = fruit.dataset.fid;
    this.fruitName = fruit.dataset.name;
    this.fruitPrice = fruit.dataset.price;
    this.count=1;
    this.closeMe = myModal.deactivate;
});
// BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentages = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        }
        else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;

    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        
    };
    var calculateTotal = function(type) {
        var sum = 0;
        Data.allItems[type].forEach(function(cur){
            sum 
            
            sum += cur.value;

        });
        Data.totals[type] = sum;
        
    };

 

    var Data =  {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0, 
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem;
            
            // create new ID
            if (Data.allItems[type].length > 0){
                ID = Data.allItems[type][Data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0 ;
            }

            // create new item based on type 'exp' or 'inc'

            if (type === 'exp'){
                newItem = new Expense (ID, des, val)
            }
            else if (type === 'inc'){
                newItem = new Income (ID, des, val)
            }

            // push it into data structure
            Data.allItems[type].push(newItem);
            //return the new element
            return newItem;

            

        },
        deleteItem: function (type, id){
            var ids, index;

            ids = Data.allItems[type].map(function(current){
                return current.id;

            });

            index = ids.indexOf(id);

            if (index !== -1) {
                Data.allItems[type].splice(index, 1);
            }

        },
        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            Data.budget = Data.totals.inc - Data.totals.exp;
            if (Data.totals.inc > 0) {
                Data.percentage = Math.round((Data.totals.exp / Data.totals.inc) * 100);
            }
            else {
                Data.percentage = -1;
            }
         },

         calculatePercentages: function (){
             Data.allItems.exp.forEach(function (cur) {
                 cur.calcPercentages(Data.totals.inc);
             });
          },
          getPercentages: function () {
              var allPerc = Data.allItems.exp.map(function (cur) {
                  return cur.getPercentage();
              });
              return allPerc;
          },

         getBudget: function() {
             return {
                 budget: Data.budget,
                 TotalInc: Data.totals.inc,
                 TotalExp: Data.totals.exp,
                 percentage: Data.percentage
             };
         },

        testing: function () {
            console.log(Data);
        }
    };

  
})();


// UI CONTROLLER
var UIcontroller = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };
    var formatNumber = function (num , type) {
        var numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')
        int = numSplit[0]
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        };
          
        var nodeListForEach = function(list, callback) {
            for (var i=0; i < list.length; i++) {
                callback(list[i], i);
            };

        };

    return {
        getinput: function () {
         return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat (document.querySelector(DOMstrings.inputValue).value)
         };

        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
             }
             else if (type === 'exp'){
                 element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

             }

             newHtml = html.replace('%id%' , obj.id);
             newHtml = newHtml.replace('%description%' , obj.description);
             newHtml = newHtml.replace('%value%' , formatNumber( obj.value, type));

             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var field, fieldsArr;
            field = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(field);
            fieldsArr.forEach(function (current, index, array){
                current.value = "";

                fieldsArr[0].focus();
            });

        },
        displayBudget: function (obj) {
            var type;
            obj.type > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber( obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber (obj.TotalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber (obj.TotalExp, 'exp');
            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
             }
            
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
        
            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0 ) {
                    current.textContent = percentages[index] + '%' ;
                }
                else {
                    current.textContent = '---';
                }
             });

        },

        displayMonth: function() {
            var now, months, month, year;
            now = new Date();

            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'Februrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        changedType: function() {
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus')

            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
            
         },
         getDOMstrings: function(){
            return DOMstrings;
        }
    };
    

})();


// GOLBAL APP CONTROLLER
var controller = (function (budgetCtrl, UIctrl) {

    var setupEventListeners = function(){

        var DOM = UIctrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

document.addEventListener('keypress', function(event){
    if (event.keyCode === 13 || event.which === 13){
        
        ctrlAddItem();
    }
});
document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType);

    };

    var updateBudget = function () {
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();

        UIctrl.displayBudget(budget);
     };

     var updatePercentages = function() {
         budgetCtrl.calculatePercentages();
         var percentages = budgetCtrl.getPercentages();
         UIctrl.displayPercentages(percentages);

     };

    
    var ctrlAddItem = function(){
        var input, newItem; 
        input = UIctrl.getinput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        UIctrl.addListItem(newItem, input.type);
        UIctrl.clearFields();

        updateBudget();

        updatePercentages();

        }

        
    };
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt( splitID[1]);

            budgetCtrl.deleteItem(type, ID);

            UIctrl.deleteListItem(itemID);

            updateBudget();

            updatePercentages();
        }
    };
    
    return {
        init: function(){
            console.log('The app is starting.')
            UIctrl.displayMonth();
            UIctrl.displayBudget({
                 budget: 0,
                 TotalInc: 0,
                 TotalExp: 0,
                 percentage: -1

            });
            setupEventListeners();
        }
    }
})(budgetController, UIcontroller);
controller.init();
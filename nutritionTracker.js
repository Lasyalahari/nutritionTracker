/**
 * Created by priyanka.t on 06/08/18.
 */

const DAILY_TOTAL_CALORIES_KEY = "dailyTotalCalories";
const FOOD_CONSUMED_KEY = "foodConsumed";
const DEFAULT_DAILY_TOTAL_CALORIES = 1700;
let dailyTotalkCals = DEFAULT_DAILY_TOTAL_CALORIES;

let foodItemsInMemoryDB = {//todo: read it from some file/db
    1: ["1 Plain Roti", 100],
    2: ["1 Small Pizza", 400],
    3: ["1 Plate Papdi Chaat", 300]
};

var tableClass = 'table table-sm table-bordered dark-border food-table';

function isSet(val) {
    switch (typeof val) {
        case "string":
            return val !== undefined && val !== "" && val !== null;
        case "object":
            return val !== null;
        case "number":
        case "boolean":
            return true;
        default:
            return false;
    }
}

function getDate(offset) {
    var date = new Date();
    date.setDate(date.getDate() - offset);
    return date.getYear() + date.getMonth() + date.getDate();
}

function getRemainingCaloriesForToday() {
    var dateString = getDate(0);
    var remainingCalories = chrome.storage.sync.get(DAILY_TOTAL_CALORIES_KEY);
    if (!(isSet(remainingCalories) && isSet(remainingCalories[dateString]))) {
        remainingCalories = remainingCalories || {};
        remainingCalories[dateString] = DEFAULT_DAILY_TOTAL_CALORIES;
    }
    return remainingCalories[dateString];
}

function changeDailyTotalCalories(totalCalories) {
    dailyTotalkCals = totalCalories || DEFAULT_DAILY_TOTAL_CALORIES;
}

function createFoodConsumedTable(dateOffset) {
    var dateString = getDate(dateOffset);
    var rows = [];
    rows.push(["Serial Number", "Food Item", "Calories"]);//todo: later add functionality to delete food item

    var foodConsumed = chrome.storage.sync.get(FOOD_CONSUMED_KEY);
    foodConsumed = foodConsumed || {};

    var foodConsumedOnGivenDate = foodConsumed[dateString];
    foodConsumedOnGivenDate = foodConsumedOnGivenDate || [];
    let serNo = 1;
    for (var foodItem in foodConsumedOnGivenDate) {
        if (foodConsumedOnGivenDate.hasOwnProperty(foodItem) && foodItemsInMemoryDB.hasOwnProperty(foodItem)) {
            rows.push([serNo++, foodItemsInMemoryDB[foodItem][0], foodItemsInMemoryDB[foodItem][1]]);
        }
    }

    var table = document.createElement("table");
    table.setAttribute("class", tableClass);
    var tableBody = document.createElement("tbody");

    var columnCount = rows[0].length;
    for (var i = 0; i < rows.length; i++) {
        if (i === 0) {
            var header = document.createElement("tr");
            for (var j = 0; j < columnCount; j++) {
                var headerCell = document.createElement("th");
                var headerCellText = document.createTextNode(rows[i][j]);
                headerCell.appendChild(headerCellText);
                header.appendChild(headerCell);
            }
            tableBody.appendChild(header);
        } else {
            var row = document.createElement("tr");
            for (let j = 0; j < columnCount; j++) {
                var cell = document.createElement("td");
                var cellText = document.createTextNode(rows[i][j]);
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
        }
    }

    table.appendChild(tableBody);
    var foodTable = document.getElementById("foodTable");
    foodTable.appendChild(table);
}

function addFoodItem(dateOffset, itemId) {
    var foodConsumed = chrome.storage.sync.get(FOOD_CONSUMED_KEY);
    foodConsumed = foodConsumed || {};

    var dateString = getDate(dateOffset);
    foodConsumed[dateString] = foodConsumed[dateString] || [];
    foodConsumed[dateString].push(itemId);
    chrome.storage.sync.set(foodConsumed);
}

function deleteFoodItem(dateOffset, itemId) {//todo

}




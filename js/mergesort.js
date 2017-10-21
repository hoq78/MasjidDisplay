function mergeSort(items) {
    // Base Case for the merge sort
    if (items.length < 2) {
        return items;
    }

    //Splits the array into 2

    var middle = parseInt(items.length / 2);
    var left = items.slice(0, middle);
    var right = items.slice(middle, items.length);

    /**
    * recursively calls the mergsort function on the
    * left and right lists until the base case is hit,
    * then merges them in order.
    */
    return merge(mergeSort(left), mergeSort(right));
}

// Merges the lists into one list in an order.
function merge(left, right) {
    var result = [];

    while (left.length && right.length) {
        if (left[0][0] >= right[0][0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length) {
        result.push(left.shift());
    }
    while (right.length) {
        result.push(right.shift());
    }
    return result;
}

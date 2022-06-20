/*
File: script.js
GUI Assignment 4: Using the jQuery Plugin/UI with Your Dynamic Table
Tim Truong, UMass Lowell Computer Science, tim_truong1@student.uml.edu
Copyright (c) 2022 by Tim Truong. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
Updated on 6/22/22 at 10:00pm.
Instructor: Professor Wenjin Zhou
Sources of Help: W3Schools and Stackoverflow
Brief Overview: The site is a continuation from hw 3's dynamic multiplication table where we add and implement
new features to our program which are sliders and user validation
that comes from the jQuery ui and validation library respectively.
Additionally, in this assignment we will also be allowing tabs where users can save their multiplication tables
as references.
*/

$(document).ready(function() {
    check(); // Added check() function so that the jQuery validation still works even if user has not submitted
    $("#box").css('height', 'auto'); // Added this css method to make form container more flexible
    document.getElementById('myForm').addEventListener("submit", function(event) {
        console.log("Submitted");
        event.preventDefault();
        check();
    });
});

function check() { // Checks if all of the user's inputs are valid before making the multiplication table
    // Added new check methods to see if max col and row values are larger than their min counterparts
    // Also added new check methods to see if any of the inputs are decimals are not and if they are we do not
    // allow it.
    // Credit to this stackoverflow link to helping how to create my own .addMethod().
    // -> https://stackoverflow.com/questions/14347177/how-can-i-validate-that-the-max-field-is-greater-than-the-min-field
    // Also credit to this jQuery validation link to helping understand some new concepts and functions.
    // -> https://jqueryvalidation.org/documentation/
    $.validator.addMethod("greaterThan_Col", function () {
        let min_c_val = Number(document.getElementById("min_cVal").value);
        let max_c_val = Number(document.getElementById("max_cVal").value);
        return max_c_val >= min_c_val;
    }, "Max column value must be greater than or equal to min.");
    $.validator.addMethod("greaterThan_Row", function () {
        let min_r_val = Number(document.getElementById("min_rVal").value);
        let max_r_val = Number(document.getElementById("max_rVal").value);
        return max_r_val >= min_r_val;
    }, "Max row value must be greater than or equal to min.");
    $.validator.addMethod("isMinCVal_decimal", function () {
        let min_cval = Number(document.getElementById("min_cVal").value);
        if (min_cval % 1 === 0) {
            return true;
        } else {
            return false;
        }
    }, "Error: Min Column Value must be an integer.");
    $.validator.addMethod("isMaxCVal_decimal", function () {
        let max_cval = Number(document.getElementById("max_cVal").value);
        if (max_cval % 1 === 0) {
            return true;
        } else {
            return false;
        }
    }, "Error: Max Column Value must be an integer.");
    $.validator.addMethod("isMinRVal_decimal", function () {
        let min_rval = Number(document.getElementById("min_rVal").value);
        if (min_rval % 1 === 0) {
            return true;
        } else {
            return false;
        }
    }, "Error: Min Row Value must be an integer.");
    $.validator.addMethod("isMaxRVal_decimal", function () {
        let max_rval = Number(document.getElementById("max_rVal").value);
        if (max_rval % 1 === 0) {
            return true;
        } else {
            return false;
        }
    }, "Error: Max Row Value must be an integer.");
    $('#myForm').validate({
        errorClass: "msg-error", // set the error messages to this custom particular class I made.
        rules: { // All the rules for each input box and pretty much checks if the input is a number
            min_cInput: { // checks if its in range between -300 and 300, if its a decimal or not, and..
                number: true, // checks if there is input at all.
                range: [-300, 300],
                isMinCVal_decimal: true, // if its not a decimal, we are good.
                required: true
            },
            max_cInput: {
                number: true,
                range: [-300, 300],
                greaterThan_Col: '#min_cInput',
                isMaxCVal_decimal: true,
                required: true
            }, 
            min_rInput: {
                number: true,
                range: [-300, 300],
                isMinRVal_decimal: true,
                required: true
            },
            max_rInput: {
                number: true,
                range: [-300, 300],
                greaterThan_Row: '#min_rInput',
                isMaxRVal_decimal: true,
                required: true
            }
        },
        messages: { // All the custom error messages for each input box
            min_cInput: {
                number: "Error: Input has to be a valid number.",
                range: "Error: Number is out of range, please input a number between -300 and 300 inclusively.",
                required: "Required: Please input a valid number between -300 and 300 inclusively."
            },
            max_cInput: {
                number: "Error: Input has to be a valid number.",
                range: "Error: Number is out of range, please input a number between -300 and 300 inclusively.",
                required: "Required: Please input a valid number between -300 and 300 inclusively."
            },
            min_rInput: {
                number: "Error: Input has to be a valid number.",
                range: "Error: Number is out of range, please input a number between -300 and 300 inclusively.",
                required: "Required: Please input a valid number between -300 and 300 inclusively."
            },
            max_rInput: {
                number: "Error: Input has to be a valid number.",
                range: "Error: Number is out of range, please input a number between -300 and 300 inclusively.",
                required: "Required: Please input a valid number between -300 and 300 inclusively."
            }
        },
        submitHandler: function() { // If submission was valid, we make the table visible and generate it based 
            let output = document.getElementById('tab'); // on input.
            output.style.display = "block";
            mult_table();
            return false;
        }, // If submission was invalid, we make the table not visible along with scroll bar.
        invalidHandler: function() {
            let scroll = document.getElementById('tab');
            scroll.style.display = "none";
            $("#Multiplication-Table").empty();
            $("#box").css('height', 'auto');
        },
    });
}

function mult_table() {
    let min_c_val = Number(document.getElementById("min_cVal").value);
    let max_c_val = Number(document.getElementById("max_cVal").value);
    let min_r_val = Number(document.getElementById("min_rVal").value);
    let max_r_val = Number(document.getElementById("max_rVal").value);
    // Should always enter this condition, if it does not we console.log("Smth").
    if ((max_r_val >= min_r_val) && (max_c_val >= min_c_val)) {
        const tr = '<tr>';
        const tr_end = '</tr>';
        const td = '<td>';
        const td_end = '</td>';
        const th = '<th>';
        const th_end = '</th>';
        let table_stuff = tr + th + th_end;

        // Builds the top header or row
        for (let i = min_r_val; i <= max_r_val; i++) {
            table_stuff += th + i + th_end;
        }

        // Builds the rest of rows and data
        for (let i = min_c_val; i <= max_c_val; i++) {
            // Outer loop builds the side header or first column header
            table_stuff += tr + th + i + th_end;
            // Inner loop builds the rest of the table cells
            for (let j = min_r_val; j <= max_r_val; j++) {
                let result = i * j;
                table_stuff += td + result + td_end;
            }
            table_stuff += tr_end;
        }

        // Credit to this link from w3schools -> https://www.w3schools.com/jquery/html_html.asp
        $('#Multiplication-Table').html(table_stuff); // Used this instead of .innerHTML
        // let table = document.getElementById("Multiplication-Table");
        // table.innerHTML = table_stuff; // Tried table.innerHTML, made very wacky changes to my css so
        // I used a jQuery version of innerHTML that I messed around with as shown above.
        return false;
    } else {
        console.log("Something went wrong");
        return false;
    }
}
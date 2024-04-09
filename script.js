class Chatbot {
    static loanDetails = {
        "Personal Loan": {
            banks: {
                "SBI": "10%",
                "HDFC": "10.5%",
                "ICICI": "10.5%"
            },
            documentationRequired: ["Identity Proof", "Address Proof", "Income Proof"],
            interestRate: 10,
            avgRepaymentMonth: 4*12  
        },
        "Home Loan": {
            banks: {
                "Bank of India": "8.30%",
                "Bajaj Housing Finance": "8.45%",
                "HDFC": "8.50%"
            },
            documentationRequired: ["Identity Proof", "Address Proof", "Income Proof", "Property Documents"],
            interestRate: 8.3,
            avgRepaymentMonth: 20*12
        },
        "Car Loan": {
            banks: {
                "HDFC": "7.9%",
                "SBI": "8.7%",
                "ICICI": "9.1%"
            },
            documentationRequired: [" KYC Documents", " Income Proof", "Car Documents"],
            interestRate: 7.9,
            avgRepaymentMonth: 5*12
        },
        "Education Loan": {
            banks: {
                "Bank of Baroda": "8.1%",
                "ICICI": "8.25%",
                "SBI": "8.5%"
            },
            documentationRequired: ["KYC Documents", "Academic Documents", "Proof of Admission", "Statement of Cost of Study/ Schedule of Expenses", "Income Proof"],
            interestRate: 8.1,
            avgRepaymentMonth: 10*12
        },
        "Business Loan": {
            banks: {
                "SBI": "10%",
                "Axis Bank": "11.05%",
                "HDFC": "12.5%"
            },
            documentationRequired: ["KYC Documents", "Business Registration Documents", "Financial Documents", "Proof of Business Address", "Income Tax Returns"],
            interestRate: 10,
            avgRepaymentMonth: 7*12
        },
        "Agriculture Loan": {
            banks: {
                "SBI": "7%",
                "ICICI": "7.5%",
                "Bank C": "Z%"
            },
            documentationRequired: [" KYC Documents", "Land Documents", "Crop Loan Documents", "KCC"],
            interestRate: 7,
            avgRepaymentMonth: 5*12
        }
    };

    constructor() {
        this.userMessage = null;
        this.counter = 0;
        this.selectedLoanType = null;
        this.loanAmount = 0;
        this.chatInput = document.querySelector(".chat-input textarea");
        this.chatbox = document.querySelector(".chatbox");
        this.inputInitHeight = this.chatInput.scrollHeight;

        this.chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.handleChat();
            }
        });
        document.querySelector(".chat-input span").addEventListener("click", () => this.handleChat());
        document.querySelector(".close-btn").addEventListener("click", () => document.body.classList.remove("show-chatbot"));
        document.querySelector(".chatbot-toggler").addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
    }

    createChatLi(message, className) {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p></p>` : `  <span><img src="https://img.icons8.com/?size=256&id=37410&format=png" alt=""></span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    }

    handleUserInput(chatElement) {
        const messageElement = chatElement.querySelector("p");

        if (this.userMessage.toLowerCase() === "quit") {
            this.counter = 0;
            messageElement.textContent = "Thank you for chatting. Goodbye!";
            this.selectedLoanType = null; // Reset the selected loan type
            return;
        }

        switch (this.counter) {
            case 0:
                messageElement.textContent = "Hello! Do you need insight about loans?";
                if (this.userMessage.toLowerCase().includes("yes")) {
                    this.counter++;
                    messageElement.innerHTML = "Great! Here are the available loan options:<br>";

                    // Display available loan options dynamically in a list
                    const loanTypesList = document.createElement("ul");
                    loanTypesList.classList.add("loan-types");
                    Object.keys(Chatbot.loanDetails).forEach(loanType => {
                        const listItem = document.createElement("li");
                        listItem.textContent = loanType;
                        loanTypesList.appendChild(listItem);
                    });
                    messageElement.appendChild(loanTypesList);

                    messageElement.innerHTML += "Please select a loan type by typing its name.";
                }
                break;
            case 1:
                // Asking the user to select a type of loan
                this.selectedLoanType = LoanCalculator.extractLoanType(this.userMessage);
                if (this.selectedLoanType) {
                    this.counter++;
                    messageElement.innerHTML = `You've selected ${this.selectedLoanType}. Here's what you need to know:
                    <ul>
                        <li>
                        Interest rate on personal loans offered by various banks
                        <div id="table-container"></div>
                        </li>
                        <li> Documentation Required: ${Chatbot.loanDetails[this.selectedLoanType].documentationRequired.join(", ")}</li>
                    </ul>
                    Would you like to calculate the time period to repay the loan based on your salary? (Yes/No)`;

                    // Create and append the table dynamically
                    const tableContainer = document.getElementById("table-container");
                    const table = document.createElement("table");
                    table.className = "bank-interest-rate";
                    table.innerHTML = `
                        <thead>
                            <tr>
                                <th>Bank</th>
                                <th>Interest Rate (Lowest-Highest)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(Chatbot.loanDetails[this.selectedLoanType].banks).map(([bank, interestRate]) => `
                                <tr>
                                    <td>${bank}</td>
                                    <td>${interestRate}</td>
                                </tr>
                            `).join('')}
                        </tbody>`;
                    tableContainer.appendChild(table);
                } else {
                    messageElement.textContent = "Sorry, I am unable to understand the type of loan you're interested in.";
                }
                break;
            case 2:
                // Handling user response about calculation
                const userResponse = this.userMessage.toLowerCase();
                if (userResponse === "yes") {
                    messageElement.textContent = "Please enter the loan amount you require:";
                    this.counter++;
                } else if (userResponse === "no") {
                    messageElement.textContent = "Okay, if you need any other help, feel free to ask about other loans.";
                    this.counter = 1;
                } else {
                    messageElement.textContent = "Sorry, I didn't understand your response. Please answer with 'Yes' or 'No'.";
                }
                break;
            case 3:
                // Handling user response about loan amount
                this.loanAmount = parseFloat(this.userMessage);
                if (!isNaN(this.loanAmount) && this.loanAmount > 0) {
                    messageElement.textContent = "Please enter your monthly salary:";
                    this.counter++;
                } else {
                    messageElement.textContent = "Sorry, please enter a valid loan amount greater than zero.";
                }
                break;
            case 4:
                // Handling user response about their salary
                const salary = parseFloat(this.userMessage);
                if (!isNaN(salary) && salary > 0) {
                    // Call the function to calculate the repayment period
                    const repaymentPeriodMonths = LoanCalculator.calculateRepaymentPeriod(salary, this.loanAmount, Chatbot.loanDetails[this.selectedLoanType].interestRate);
                    if (isFinite(repaymentPeriodMonths)) {
                        const repaymentPeriod = repaymentPeriodMonths % 12 === 0 ? `${Math.floor(repaymentPeriodMonths / 12)} years` : `${Math.floor(repaymentPeriodMonths / 12)} years and ${repaymentPeriodMonths % 12} months`
                        const worthTakingLoan = repaymentPeriodMonths <= Chatbot.loanDetails[this.selectedLoanType].avgRepaymentMonth ? "It's worth taking this loan." : "It might not be worth taking this loan.";
                        messageElement.innerHTML = `Based on your salary, it will take approximately <b>${repaymentPeriod}</b> to repay the loan. <i>${worthTakingLoan}<i>`;
                    } else {
                        messageElement.innerHTML = `Based on your salary, <b>Loan amount too High</b>, It is not recommended to apply for such loans.`;
                    }
                    this.counter = 0;
                } else {
                    messageElement.textContent = "Sorry, I didn't understand your salary. Please enter a valid number.";
                    this.counter = 4;
                }
                break;
            default:
                messageElement.classList.add("error");
                messageElement.textContent = "Sorry, I am unable to answer your request.";
                break;
        }

        this.chatbox.scrollTo(0, this.chatbox.scrollHeight);
    }

    handleChat() {
        this.userMessage = this.chatInput.value.trim();
        // Check if userMessage is empty
        if (!this.userMessage) {
            this.displayErrorMessage("Please enter a message before sending.");
            return;
        }

        // Clear the input textarea and set its height to default
        this.chatInput.value = "";
        this.chatInput.style.height = `${this.inputInitHeight}px`;

        this.chatbox.appendChild(this.createChatLi(this.userMessage, "outgoing"));
        this.chatbox.scrollTo(0, this.chatbox.scrollHeight);

        setTimeout(() => {
            // Display "Thinking..." message while waiting for the response
            const incomingChatLi = this.createChatLi("...", "incoming");
            this.chatbox.appendChild(incomingChatLi);
            this.chatbox.scrollTo(0, this.chatbox.scrollHeight);
            this.handleUserInput(incomingChatLi);
        }, 600);

        this.removeErrorMessage();
    }

    displayErrorMessage(message) {
        const errorMessageElement = document.createElement("div");
        errorMessageElement.classList.add("error");
        errorMessageElement.textContent = message;

        this.chatbox.appendChild(errorMessageElement);
        this.chatbox.scrollTo(0, this.chatbox.scrollHeight);

        setTimeout(() => {
            this.removeErrorMessage();
        }, 5000);
    }

    removeErrorMessage() {
        const errorMessage = document.querySelector(".error");
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

class LoanCalculator {
    static calculateRepaymentPeriod(salary, loanAmount, interestRate) {
        const monthlyPayment = salary * 0.3;  //30% of salary
        const monthlyInterestRate = (interestRate / 100) / 12;
        const months = Math.ceil(Math.log(monthlyPayment / (monthlyPayment - monthlyInterestRate * loanAmount)) / Math.log(1 + monthlyInterestRate));
        return isNaN(months) ? Infinity : months;
    }

    static extractLoanType(message) {
        const loanTypes = Object.keys(Chatbot.loanDetails);
        for (const loanType of loanTypes) {
            if (message.toLowerCase().includes(loanType.toLowerCase())) {
                return loanType;
            }
        }
        return null;
    }
}

// Instantiate Chatbot
const chatbot = new Chatbot();

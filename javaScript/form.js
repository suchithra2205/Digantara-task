
document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 0;
    const steps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-bar div");

    loadFormData();  // Load saved data when page reloads

    document.getElementById("next1").addEventListener("click", () => {
        if (validateStep(0)) changeStep(1);
    });

    document.getElementById("next2").addEventListener("click", () => {
        if (validateStep(1)) changeStep(2);
    });

    document.getElementById("prev2").addEventListener("click", () => changeStep(0));
    document.getElementById("prev3").addEventListener("click", () => changeStep(1));

    function changeStep(step) {
        steps[currentStep].style.display = "none";  
        progressSteps[currentStep].classList.remove("active");

        currentStep = step;

        steps[currentStep].style.display = "block"; 
        progressSteps[currentStep].classList.add("active");

        if (currentStep === 2) displaySummary();

        saveFormData(); // Save progress
    }

    function validateStep(step) {
        let isValid = true;
        let inputs = steps[step].querySelectorAll("input, select, textarea");

        inputs.forEach(input => {
            let errorSpan = input.nextElementSibling;
            if (!errorSpan || !errorSpan.classList.contains("error-message")) {
                errorSpan = document.createElement("span");
                errorSpan.classList.add("error-message");
                input.parentNode.appendChild(errorSpan);
            }

            if (!input.value.trim()) {
                errorSpan.textContent = "This field is required!";
                input.classList.add("error");
                isValid = false;
            } else if (input.id === "email" && !validateEmail(input.value)) {
                errorSpan.textContent = "Invalid email!";
                input.classList.add("error");
                isValid = false;
            } else if (input.id === "phone" && !validatePhone(input.value)) {
                errorSpan.textContent = "Invalid phone number!";
                input.classList.add("error");
                isValid = false;
            } else {
                errorSpan.textContent = "";
                input.classList.remove("error");
            }
        });

        return isValid;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^[0-9]{10}$/.test(phone);
    }

    function displaySummary() {
        document.getElementById("summary").innerHTML = `
            <p><strong>Name:</strong> ${document.getElementById("name").value}</p>
            <p><strong>Date of Birth:</strong> ${document.getElementById("dob").value}</p>
            <p><strong>Gender:</strong> ${document.getElementById("gender").value}</p>
            <p><strong>Email:</strong> ${document.getElementById("email").value}</p>
            <p><strong>Phone:</strong> ${document.getElementById("phone").value}</p>
            <p><strong>Address:</strong> ${document.getElementById("address").value}</p>
        `;
    }

    document.getElementById("multiStepForm").addEventListener("submit", function (e) {
        e.preventDefault();
        if (validateStep(2)) {
            alert("Form Submitted Successfully!");
            localStorage.clear(); // Clear saved data after submission
        }
    });

    function saveFormData() {
        let formData = {
            name: document.getElementById("name").value,
            dob: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            step: currentStep
        };
        localStorage.setItem("formData", JSON.stringify(formData));
    }

    function loadFormData() {
        let savedData = JSON.parse(localStorage.getItem("formData"));
        if (savedData) {
            document.getElementById("name").value = savedData.name;
            document.getElementById("dob").value = savedData.dob;
            document.getElementById("gender").value = savedData.gender;
            document.getElementById("email").value = savedData.email;
            document.getElementById("phone").value = savedData.phone;
            document.getElementById("address").value = savedData.address;
            
            currentStep = savedData.step || 0;

            steps.forEach((step, index) => {
                step.style.display = index === currentStep ? "block" : "none";
            });

            for (let i = 0; i <= currentStep; i++) {
                progressSteps[i].classList.add("active");
            }
        }
    }
});

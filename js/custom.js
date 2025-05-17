document.querySelectorAll(".phone").forEach((phoneInput, index) => {
  const countrySelect = document.querySelectorAll(".country")[index];
  const timezoneSelect = document.querySelectorAll(".timezone")[index];

  // 1. Populate country dropdown
  fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
    .then((res) => res.json())
    .then((data) => {
      data.sort((a, b) => a.name.common.localeCompare(b.name.common));
      data.forEach((country) => {
        const opt = document.createElement("option");
        opt.value = country.cca2;
        opt.textContent = country.name.common;
        countrySelect.appendChild(opt);
      });
    });

  // 2. Handle country change
  countrySelect.addEventListener("change", () => {
    const selectedCode = countrySelect.value;
    timezoneSelect.innerHTML = `<option value="">Select Timezone</option>`;
    timezoneSelect.disabled = true;

    if (selectedCode === "IN") {
      timezoneSelect.disabled = false;
      const opt = document.createElement("option");
      opt.value = "IST";
      opt.textContent = "Indian Standard Time (UTC+05:30)";
      timezoneSelect.appendChild(opt);
    } else {
      fetch(`https://restcountries.com/v3.1/alpha/${selectedCode}`)
        .then((res) => res.json())
        .then((data) => {
          const country = data[0];
          if (country.timezones && country.timezones.length) {
            timezoneSelect.disabled = false;
            country.timezones.forEach((tz) => {
              const opt = document.createElement("option");
              opt.value = tz;
              opt.textContent = tz;
              timezoneSelect.appendChild(opt);
            });
          }
        });
    }
  });

  // 3. Initialize intl-tel-input
  const iti = window.intlTelInput(phoneInput, {
    initialCountry: "auto",
    separateDialCode: true,
    geoIpLookup: (callback) => {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          const countryCode = data.country_code.toLowerCase();
          callback(countryCode);
          setTimeout(() => {
            setSelectedOptionByValue(countrySelect, countryCode.toUpperCase());
            countrySelect.dispatchEvent(new Event("change"));
          }, 300);
        })
        .catch(() => callback("us"));
    },
  });

  // 4. Show full phone on blur
  phoneInput.addEventListener("blur", () => {
    console.log("Full phone:", iti.getNumber());
  });
});

// Utility: Select dropdown option by value
function setSelectedOptionByValue(selectEl, value) {
  for (let option of selectEl.options) {
    if (option.value === value) {
      selectEl.value = value;
      break;
    }
  }
}

// Handle Step 1 to Step 2 navigation with validation
$(".step2Active").click(function () {
  let isValid = true;

  $(".step1 :input[required]").each(function () {
    if (!$(this).val().trim()) {
      isValid = false;
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });

  if (isValid) {
    $(".step1").css("transform", "translateX(-100%)");
    $(".step2").css("left", "0");
  }
});

// Go back to Step 1
$(".step1Active").click(function () {
  $(".step1").css("transform", "translateX(0)");
  $(".step2").css("left", "100%");
});

// Final form submission — check Step 1 + Step 2
$("form").on("submit", function (e) {
  let isValidStep1 = true;
  let isValidStep2 = true;

  $(".step1 :input[required]").each(function () {
    if (!$(this).val().trim()) {
      isValidStep1 = false;
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });

  $(".step2 :input[required]").each(function () {
    if (!$(this).val().trim()) {
      isValidStep2 = false;
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });

  // If Step 1 has invalid fields, go back
  if (!isValidStep1) {
    e.preventDefault();
    $(".step1").css("transform", "translateX(0)");
    $(".step2").css("left", "100%");
    $("html, body").animate(
      {
        scrollTop: $(".step1 .is-invalid:first").offset().top - 80,
      },
      400
    );
  }

  // If Step 2 has invalid fields, prevent submission
  if (!isValidStep2) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $(".step2 .is-invalid:first").offset().top - 80,
      },
      400
    );
  }
});
$(function () {
  AOS.init();
  window.addEventListener("load", AOS.refresh);
  $(window).on("scroll", function () {
    $(function () {
      if ($(".stricky").length) {
        var strickyScrollPos = 60;
        if ($(window).scrollTop() > strickyScrollPos) {
          $(".stricky").addClass("stricky-fixed");
          $(".scroll-to-top").fadeIn(1500);
          $(".iconRotate").css("width", "100px").delay(1000);
        } else if ($(this).scrollTop() <= strickyScrollPos) {
          $(".stricky").removeClass("stricky-fixed");
          $(".scroll-to-top").fadeOut(1500);
          $(".iconRotate").css("width", "150px").delay(1000);
        }
      }
    });
  });
});

$(function () {
  $(window).on("scroll", function () {
    var scrolled = $(window).scrollTop();
    if (scrolled > 80) $(".go-top").addClass("active");
    if (scrolled < 80) $(".go-top").removeClass("active");
  });
  $(function () {
    $(".go-top").on("click", function () {
      $("html, body").animate(
        {
          scrollTop: "0",
        },
        500
      );
    });
  });
});

$(function () {
  var a = 0;
  $(window).scroll(function () {
    if ($(".counter")[0]) {
      var oTop = $(".counter").offset().top - window.innerHeight;
      if (a == 0 && $(window).scrollTop() > oTop) {
        $(".counter-value").each(function () {
          var $this = $(this),
            countTo = $this.attr("data-count");
          $({
            countNum: $this.text(),
          }).animate(
            {
              countNum: countTo,
            },

            {
              duration: 1000,
              easing: "swing",
              step: function () {
                $this.text(Math.floor(this.countNum));
              },
              complete: function () {
                $this.text(this.countNum);
                //alert('finished');
              },
            }
          );
        });
        a = 1;
      }
    }
  });
});
document.querySelectorAll(".date").forEach((dateInput) => {
  const timeSlot = dateInput.closest("form")?.querySelector(".timeslot");

  // Set today's date as minimum
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);

  // On date change, generate time slots
  dateInput.addEventListener("change", () => {
    if (!timeSlot) return;

    timeSlot.innerHTML = '<option value="">Select Time Slot</option>';
    let start = new Date();
    start.setHours(16, 0, 0, 0); // 4:00 PM

    const end = new Date();
    end.setHours(20, 30, 0, 0); // 8:00 PM

    while (start < end) {
      const hour = start.getHours();
      const minutes = start.getMinutes();
      const timeStr = `${formatHour(hour)}:${minutes === 0 ? "00" : minutes} ${
        hour >= 12 ? "PM" : "AM"
      }`;

      const option = document.createElement("option");
      option.value = timeStr;
      option.textContent = timeStr;
      timeSlot.appendChild(option);

      start.setMinutes(start.getMinutes() + 30);
    }

    timeSlot.disabled = false;
  });
});

// Helper to format hour in 12-hour format
function formatHour(hour) {
  const h = hour % 12 || 12;
  return h < 10 ? "0" + h : h;
}

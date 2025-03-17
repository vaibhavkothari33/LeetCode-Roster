const button = document.querySelector("button");
    const input = document.querySelector("input");
    const roastContainer = document.querySelector(".roast-container");
    const roast = document.querySelector(".roast");
    const shareButtons = document.querySelector(".share-buttons");
    const shareButtonL = document.getElementById('shareButtonL');
    const shareButtonT = document.getElementById('shareButtonT');

    // Hide the roast container and share buttons initially
    roastContainer.classList.add('hidden');
    shareButtons.classList.add('hidden');

    let radialChart = null;
    let doughnutChart = null;

    button.addEventListener("click", function (e) {
      e.preventDefault();
      const username = input.value.trim();
      if (username) {
        getAllUsers(username);
        input.value = "";
      }
    });

    async function getAllUsers(username) {
      try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        const user = await response.json();

        if (user.status !== 'error') {
          roastContainer.classList.remove('hidden');
          shareButtons.classList.remove('hidden');
          
          updateRoast(user);
          updateCharts(user);
          
          // Add animation class
          roastContainer.classList.add('fade-in');
        } else {
          roastContainer.classList.remove('hidden');
          shareButtons.classList.add('hidden');
          roast.innerHTML = "<h2>404: User Not Found</h2><p>Please check the username and try again.</p>";
          roastContainer.classList.add('fade-in');
        }
      } catch (error) {
        console.error("ERROR: ", error);
        roastContainer.classList.remove('hidden');
        shareButtons.classList.add('hidden');
        roast.innerHTML = "<h2>Error fetching user data</h2><p>Please try again later.</p>";
        roastContainer.classList.add('fade-in');
      }
    }

    function updateRoast(user) {
      const { easySolved, mediumSolved, hardSolved, totalSolved, totalSubmissions, acceptedSubmissions, acceptanceRate } = user;

      if (easySolved === 0) {
        roast.innerHTML = `<h3>What's wrong with you? Might want to try some hard questions for a real challenge! Staying in your comfort zone won't help you grow. Push your limits and see how far you can go.</h3>`;
      }
      else if (easySolved < 25 && mediumSolved < 10 && hardSolved < 3) {
        roast.innerHTML = `<h3>You're just a newbie on LeetCode. Need to work hard! It's like you're scared of the medium and hard questions. Come on, step up your game and try to tackle some challenging problems! Or are you just here for the participation trophy?</h3>`;
      }
      else if (acceptanceRate < 54) {
        roast.innerHTML = `<h3>Your acceptance rate is ${acceptanceRate.toFixed(2)}%. Yikes! Looks like accuracy isn't your strong suit. You need to click on Run button not on Submit 💀. Take a breather, focus, and dive deeper into problem-solving strategies. Quality over quantity, remember? Precision wins the race in mastering LeetCode challenges!</h3>`;
      }
      else if (totalSolved > 25 && totalSolved < 50) {
        roast.innerHTML = `<h3>Hey, you've dipped your toes into LeetCode with ${totalSolved} questions solved. Not bad, but let's be real—those are rookie numbers. Time to step it up and dive deeper into the algorithmic abyss. The hard problems aren't going to solve themselves, champ. Get cracking and level up your coding game!</h3>`;
      }
      else if (hardSolved > 150) {
        roast.innerHTML = `<h3>Impressive! You've conquered more than 150 hard questions on LeetCode. It's clear you love a challenge and thrive under pressure. Keep pushing those boundaries and tackling the toughest problems out there. You're on a path to mastery—hard problems beware, there's no stopping this LeetCode warrior!</h3>`;
      }
      else if (hardSolved > 40) {
        roast.innerHTML = `<h3>Impressive! You've conquered ${hardSolved} hard questions on LeetCode. It's clear you love a challenge and thrive under pressure. Keep pushing those boundaries and tackling the toughest problems out there. You're on a path to mastery—hard problems beware, there's no stopping this LeetCode warrior!</h3>`;
      }
      else if (totalSolved > 200 && mediumSolved - easySolved > 30) {
        roast.innerHTML = `<h3>You seem to dodge easy questions like they're beneath you. Bold move, champ. But let's not kid ourselves—if you can't handle the basics, those tough problems are going to eat you alive. You crush medium questions, but the hard ones seem to crush you! Stop pretending you're too cool for the basics and face those hard ones head-on. Quit running and start conquering. You've got this—or do you?</h3>`;
      }
      else if (totalSolved > 200 && mediumSolved - easySolved < 30) {
        roast.innerHTML = `<h3>Wow, you balance easy and medium questions like a pro! But let's be real, it's time to step out of your comfort zone. You're evenly matched with the easy and medium questions, but are you ready to face the hard ones? Keep pushing yourself, because greatness awaits beyond the comfort of balance. You've got the skills, now show those hard problems who's boss!</h3>`;
      }
      else if (easySolved > mediumSolved) {
        roast.innerHTML = `<h3>You've solved a lot of easy questions but can't handle the medium ones? It's time to leave the kiddie pool and dive into deeper waters. Start working on those medium questions! Or are you just an easy mode hero?</h3>`;
      }
      else if (totalSubmissions > 2000 && acceptedSubmissions < 500) {
        roast.innerHTML = `<h3>You submit a lot, but not many get accepted. Keep trying! Focus on quality over quantity, and make sure your solutions are polished before you hit submit. Or do you just like seeing the red 'Wrong Answer' screen?</h3>`;
      }
      else {
        roast.innerHTML = `<h3>Keep pushing and improving! You're on the right track.</h3>`;
      }
    }

  function updateCharts(user) {
  const { easySolved, mediumSolved, hardSolved, acceptanceRate } = user;

  const radialChartOptions = {
    chart: {
      height: 240,
      type: "radialBar",
      foreColor: '#ffffff'
    },
    series: [acceptanceRate],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: "65%",
        },
        track: {
          background: 'rgba(255, 255, 255, 0.2)',
        },
        dataLabels: {
          showOn: "always",
          name: {
            offsetY: -10,
            show: true,
            color: "#ffffff",
            fontSize: "14px",
          },
          value: {
            color: "#ffffff",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Acceptance Rate"],
    colors: ["#ff6b6b"],
  };

  // Destroy previous chart if it exists
  if (radialChart) {
    radialChart.destroy();
  }

  // Create new radial chart
  radialChart = new ApexCharts(document.querySelector("#chart"), radialChartOptions);
  radialChart.render();

  // Destroy previous doughnut chart if it exists
  if (doughnutChart) {
    doughnutChart.destroy();
  }

  // Create new doughnut chart for problem distribution
  const ctx = document.querySelector('.my-chart').getContext('2d');
  doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [{
        data: [easySolved, mediumSolved, hardSolved],
        backgroundColor: [
          '#4CAF50', // Green for easy
          '#FFC107', // Yellow for medium
          '#F44336'  // Red for hard
        ],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ffffff',
            font: {
              size: 12
            },
            padding: 10
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '70%',
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}

// Share functionality
shareButtonL.addEventListener('click', function() {
  const username = input.value.trim() || 'my LeetCode profile';
  const text = `Check out my roast on LeetCode-Roaster! ${document.querySelector('.roast').innerText}`;
  const url = window.location.href;
  
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent('LeetCode Roaster')}&summary=${encodeURIComponent(text)}`;
  
  window.open(linkedinUrl, '_blank');
});

shareButtonT.addEventListener('click', function() {
  const username = input.value.trim() || 'my LeetCode profile';
  const text = `Check out my roast on LeetCode-Roaster! ${document.querySelector('.roast').innerText.substring(0, 200)}...`;
  const url = window.location.href;
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  
  window.open(twitterUrl, '_blank');
});

// Handle Enter key press in input field
input.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    button.click();
  }
});

// Add loading state
function setLoading(isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = 'Loading...';
  } else {
    button.disabled = false;
    button.innerHTML = 'Submit';
  }
}

// Update the getAllUsers function to show loading state
async function getAllUsers(username) {
  try {
    setLoading(true);
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    const user = await response.json();

    if (user.status !== 'error') {
      roastContainer.classList.remove('hidden');
      shareButtons.classList.remove('hidden');
      
      updateRoast(user);
      updateCharts(user);
      
      // Add animation class
      roastContainer.classList.add('fade-in');
    } else {
      roastContainer.classList.remove('hidden');
      shareButtons.classList.add('hidden');
      roast.innerHTML = "<h2>404: User Not Found</h2><p>Please check the username and try again.</p>";
      roastContainer.classList.add('fade-in');
    }
  } catch (error) {
    console.error("ERROR: ", error);
    roastContainer.classList.remove('hidden');
    shareButtons.classList.add('hidden');
    roast.innerHTML = "<h2>Error fetching user data</h2><p>Please try again later.</p>";
    roastContainer.classList.add('fade-in');
  } finally {
    setLoading(false);
  }
}

// Initialize charts with empty data on page load
window.addEventListener('DOMContentLoaded', () => {
  const emptyUser = {
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    acceptanceRate: 0
  };
  
  // Initialize empty charts
  updateCharts(emptyUser);
});

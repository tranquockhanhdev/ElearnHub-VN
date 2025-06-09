
  function darkMode() {
    const html = document.documentElement;
    const switcher = document.querySelector('#darkModeSwitch');

    // Hàm bật Dark mode
    const enableDarkMode = () => {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('data-theme', 'dark');
    };

    // Hàm tắt Dark mode
    const disableDarkMode = () => {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('data-theme', 'light');
    };

    // Kiểm tra trạng thái lưu trước đó
    const savedTheme = localStorage.getItem('data-theme');
    if (savedTheme === 'dark') {
      enableDarkMode();
    } else {
      disableDarkMode();
    }

    // Bắt sự kiện click để chuyển đổi
    if (switcher) {
      switcher.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('data-theme');
        if (currentTheme === 'dark') {
          disableDarkMode();
        } else {
          enableDarkMode();
        }
      });
    }
  }

  // Gọi darkMode khi trang load
  window.addEventListener('DOMContentLoaded', () => {
    darkMode();
  });

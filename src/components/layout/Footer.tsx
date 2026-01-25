/**
 * Footer component with creator signature
 * Displays credits and social links
 */
function Footer() {
  return (
    <footer className="px-4 py-3 border-t border-gray-200 bg-gray-50">
      <p className="text-xs text-gray-500 text-center">
        Created by{' '}
        <a
          href="https://serkanbayraktar.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
        >
          Serkanby
        </a>
        {' | '}
        <a
          href="https://github.com/Serkanbyx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
        >
          Github
        </a>
      </p>
    </footer>
  );
}

export default Footer;

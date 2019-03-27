import ReactGA from 'react-ga';

const getTermFromPath = (path) => {
    var term = "";
    if (path.startsWith("search")) {
        term = decodeURIComponent(path.substring(7));
    }
    return term;
}

const searchHashRedirect = () => {
    var term = window.location.hash.substring(2);
    if (term && window.location.pathname === "/") {
        console.log("redirecting");
        window.location.replace("/search/" + term);
    }
}

const trackPageViewInGoogleAnalytics = () => {
    if (process.env["NODE_ENV"] === "production") {
        // get path after origin:
        ReactGA.pageview(window.location.href.slice(window.location.origin.length));
    }
}

export { getTermFromPath, searchHashRedirect, trackPageViewInGoogleAnalytics };
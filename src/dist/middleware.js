"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.config = void 0;
var middleware_1 = require("next-intl/middleware");
var server_1 = require("next/server");
var routing_1 = require("./i18n/routing");
// Define public routes that don't require authentication
var publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
    "/post",
    "/post/:postId",
];
// Define profile creation routes
var profileCreationRoutes = {
    user: "/user/create-profile",
    company: ["/company/create-profile", "/company/who-can-see-profile"]
};
// Define shared routes accessible by both user and company
var sharedRoutes = [
    "/chat",
    "/addnotifi",
    "/connections",
    "/single-user",
    "/applicationjob/:id",
    "/company/single-company",
    // "/company/single-company/:id/:subid",
    // "/company/single-company/:id/Profile",
    "/company/single-company/:id/subscription",
    "/company/single-company/:id/applications",
    "/company/single-company/:id/applications/:subid",
    "/company/single-company/:id/previousplans",
];
// Define role-specific routes
var roleBasedRoutes = {
    user: [
        "/feed",
        "/user",
        "/profile",
        "/settings",
        "/jobs",
        "/addnotifi",
        "/messages",
        "/jobs/apply-now/:id/:name",
    ],
    company: [
        "/company/feed",
        "/company/profile",
        "/company/settings",
        "/company/create-job",
        "/company/applications",
        "/company/candidates",
    ]
};
// Create the internationalization middleware
var intlMiddleware = middleware_1["default"](routing_1.routing);
function middleware(request) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var response, pathname, locale, pathWithoutLocale, defLoc, userRole, isAuthenticated, safeLocale, profileCreated, currentPath, profileCreationRoute, isSharedRoute, isUserAllowed, isCompanyAllowed;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, intlMiddleware(request)];
                case 1:
                    response = _e.sent();
                    pathname = request.nextUrl.pathname;
                    locale = request.nextUrl.pathname.split("/")[1];
                    pathWithoutLocale = pathname.replace("/" + locale, "") || "/";
                    defLoc = routing_1.routing.defaultLocale;
                    userRole = (_b = (_a = request.cookies.get("userRole")) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.toLowerCase();
                    isAuthenticated = ((_c = request.cookies.get("isAuthenticated")) === null || _c === void 0 ? void 0 : _c.value) === "true";
                    safeLocale = locale || defLoc;
                    // Special handling for post/:postId and applicationjob/:id - always allow access
                    if (pathWithoutLocale.startsWith("post/")) {
                        return [2 /*return*/, response];
                    }
                    // Handle public routes
                    if (publicRoutes.includes(pathWithoutLocale)) {
                        // If user is already logged in, redirect to their role-specific home page
                        if (isAuthenticated && userRole) {
                            if (userRole === "user") {
                                return [2 /*return*/, server_1.NextResponse.redirect(new URL("/" + safeLocale + "/feed", request.url))];
                            }
                            else if (userRole === "company") {
                                return [2 /*return*/, server_1.NextResponse.redirect(new URL("/" + safeLocale + "/company/feed", request.url))];
                            }
                        }
                        return [2 /*return*/, response];
                    }
                    // If not authenticated and trying to access protected route
                    if (!isAuthenticated || !userRole) {
                        return [2 /*return*/, server_1.NextResponse.redirect(new URL("/" + locale + "/login", request.url))];
                    }
                    profileCreated = ((_d = request.cookies.get("profileCreated")) === null || _d === void 0 ? void 0 : _d.value) === "true";
                    currentPath = pathWithoutLocale;
                    // If profile is not created, redirect to appropriate profile creation page
                    if (!profileCreated) {
                        profileCreationRoute = profileCreationRoutes[userRole];
                        if (Array.isArray(profileCreationRoute)) {
                            if (!profileCreationRoute.includes(currentPath)) {
                                return [2 /*return*/, server_1.NextResponse.redirect(new URL("/" + locale + profileCreationRoute[0], request.url))];
                            }
                        }
                        else {
                            if (currentPath !== profileCreationRoute) {
                                return [2 /*return*/, server_1.NextResponse.redirect(new URL("/" + locale + profileCreationRoute, request.url))];
                            }
                        }
                        return [2 /*return*/, response];
                    }
                    isSharedRoute = sharedRoutes.some(function (route) { return currentPath === route || currentPath.startsWith(route + "/"); });
                    // If it's a shared route, allow access regardless of role
                    if (isSharedRoute) {
                        return [2 /*return*/, response];
                    }
                    // Handle role-based access
                    if (userRole === "user") {
                        // Check if user is trying to access company routes
                        if (pathWithoutLocale.startsWith("/company")) {
                            return [2 /*return*/, server_1.NextResponse.redirect(new URL("/" + locale + "/feed", request.url))];
                        }
                        isUserAllowed = roleBasedRoutes.user.some(function (route) { return currentPath === route || currentPath.startsWith(route + "/"); });
                        if (!isUserAllowed) {
                            return [2 /*return*/, server_1.NextResponse.redirect(new URL("/" + locale + "/feed", request.url))];
                        }
                    }
                    else if (userRole === "company") {
                        // Check if company is trying to access user routes that are not shared
                        if (!pathWithoutLocale.startsWith("/company") &&
                            !pathWithoutLocale.startsWith("/connections") &&
                            !pathWithoutLocale.startsWith("/jobs/")) {
                            return [2 /*return*/, server_1.NextResponse.redirect(new URL("/" + locale + "/company/feed", request.url))];
                        }
                        // Skip permission check for shared routes
                        if (isSharedRoute) {
                            return [2 /*return*/, response];
                        }
                        isCompanyAllowed = roleBasedRoutes.company.some(function (route) { return currentPath === route || currentPath.startsWith(route + "/"); });
                        if (!isCompanyAllowed) {
                            return [2 /*return*/, server_1.NextResponse.redirect(new URL("/" + locale + "/company/feed", request.url))];
                        }
                    }
                    return [2 /*return*/, response];
            }
        });
    });
}
exports["default"] = middleware;
exports.config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
};

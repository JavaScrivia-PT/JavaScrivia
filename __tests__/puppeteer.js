const puppeteer = require("puppeteer"); // 1

let browser;
let page;

describe('Front end puppeteer tests: Login and Signup', () => {
  jest.setTimeout(15000);
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
    });
    page = await browser.newPage();
  });
  beforeEach(async () => await page.goto("http://localhost:3000/"))
  
  // 3
  it("Homepage loads successfully", async () => {
    const title = await page.$eval('.landingH2', el => el.innerHTML);
    expect(title).toEqual('Please sign up or log in to continue.');
  });
  it('Homepage renders login and signup buttons', async () => {
    const signup = await page.$eval('.landingButton', el => el.innerHTML);
    expect(signup).toEqual('Log In');
  });
  describe('Login tests', () => {
  it('Clicking the login button loads login page components', async () => {
    await page.click('.landingButton')
    const loginButton = await page.$eval('.landingButton', el => el.innerHTML);
    expect(loginButton).toEqual('enter');
  });
  it('Login page rejects invalid username', async () => {
    await page.click('.landingButton')
    const loginButton = await page.$eval('.landingButton', el => el.innerHTML);
    await page.focus('#user1');
    await page.keyboard.type('abcdefg');
    await page.focus('#pass1');
    await page.keyboard.type('abcdefg');
    await page.click('.landingButton')
    await page.waitForFunction('document.querySelector("h3").innerHTML == "Your username/password is incorrect"')

    const bannerText = await page.$eval('h3', el => el.innerHTML);
    expect(bannerText).toEqual('Your username/password is incorrect');
  });
  it('Login page rejects invalid password', async () => {
    await page.click('.landingButton')
    const loginButton = await page.$eval('.landingButton', el => el.innerHTML);
    await page.focus('#user1');
    await page.keyboard.type('luke');
    await page.focus('#pass1');
    await page.keyboard.type('abcdefg');
    await page.click('.landingButton')
    await page.waitForFunction('document.querySelector("h3").innerHTML == "Your username/password is incorrect"')

    const bannerText = await page.$eval('h3', el => el.innerHTML);
    expect(bannerText).toEqual('Your username/password is incorrect');
  });
  it('Logging in with valid credentials loads Trivia', async () => {
    await page.click('.landingButton')
    const loginButton = await page.$eval('.landingButton', el => el.innerHTML);
    await page.focus('#user1');
    await page.keyboard.type('luke');
    await page.focus('#pass1');
    await page.keyboard.type('123');
    await page.click('.landingButton')
    await page.waitForSelector('h2');
    await page.waitForFunction('document.querySelector("h2").innerHTML == "Name: luke"')
    const bannerText = await page.$eval('h2', el => el.innerHTML);
    expect(bannerText).toEqual('Name: luke');
  });

  });
  describe('Signup tests', () => {
  it('Clicking the signup button loads signup page components', async () => {
    await page.waitForSelector('.landingButton')
    const selectors = await page.$$('.landingButton')
    await selectors[1].click()
    page.waitForSelector('h3')

    const loginButton = await page.$eval('h3', el => el.innerHTML);
    expect(loginButton).toEqual('Sign up! Please be advised that your username will also be your leaderboard display name');
  });
  it('Signup rejects existing usernames', async () => {
    await page.waitForSelector('.landingButton')
    const selectors = await page.$$('.landingButton')
    await selectors[1].click()
    page.waitForSelector('h3')
    const loginButton = await page.$eval('h3', el => el.innerHTML);
    expect(loginButton).toEqual('Sign up! Please be advised that your username will also be your leaderboard display name');
  });
  });
  
  afterAll(() => {
    browser.close();
  });
})
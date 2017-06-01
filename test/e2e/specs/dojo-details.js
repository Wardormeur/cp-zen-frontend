const DojoPage = require('../page-objects/dojo-page');
const DojoDetailsPage = require('../page-objects/dojo-details');
const EventDetailsPage = require('../page-objects/event-details');
const EventSessionsPage = require('../page-objects/event-sessions');

function openDojoWithLatLong() {
  DojoPage.openWithLatLong(10, 89);
  DojoPage.dojoListItems[2].click();
}

describe('Dojo details page', () => {
  it('should show dojo details', () => {
    openDojoWithLatLong();
    DojoDetailsPage.name.waitForVisible();

    const name = DojoDetailsPage.name.getText();
    expect(name).to.equal('Dublin Ninja Kids');

    const time = DojoDetailsPage.time.getText();
    expect(time).to.equal('Saturdays 11 am - 1 pm');

    const address = DojoDetailsPage.address.getText();
    expect(address).to.equal('CHQ Building,1 Custom House Quay, North Dock, Dublin, Ireland');

    const details = DojoDetailsPage.details.getHTML(false);
    expect(details).to.equal('<p>This is the Dojo details section</p>\n');

    const email = DojoDetailsPage.email.getText();
    expect(email).to.equal('dublinninjakids@gmail.com');

    const website = DojoDetailsPage.website.getText();
    expect(website).to.equal('www.dublinninjakids.com');

    const facebook = DojoDetailsPage.facebook.getText();
    expect(facebook).to.equal('https://www.facebook.com/CoderDojo');

    const twitter = DojoDetailsPage.twitter.getText();
    expect(twitter).to.equal('https://twitter.com/CoderDojo');

    const googleGroup = DojoDetailsPage.googleGroup.getText();
    expect(googleGroup).to.equal('dublinninjakids@google.group.com');
  });

  it('should show dojo\'s events', () => {
    openDojoWithLatLong();
    DojoDetailsPage.name.waitForVisible();

    const firstEventName = DojoDetailsPage.eventNames(0).getText();
    expect(firstEventName).to.equal('My First Amazing Event');
    expect(DojoDetailsPage.eventDates(0).getText()).to.equal('2017-06-06T16:30:00.000Z');

    const secondEventName = DojoDetailsPage.eventNames(1).getText();
    expect(secondEventName).to.equal('My Second Amazing Event');
    expect(DojoDetailsPage.eventDates(1).getText()).to.equal('2017-06-03T10:00:00.000Z');
    expect(DojoDetailsPage.eventDates(2).getText()).to.equal('2017-06-17T10:00:00.000Z');
    expect(DojoDetailsPage.eventDates(3).getText()).to.equal('2017-07-01T10:00:00.000Z');
    expect(DojoDetailsPage.eventDates(4).getText()).to.equal('2017-07-15T10:00:00.000Z');
    expect(DojoDetailsPage.eventDates(5).getText()).to.equal('2017-07-29T10:00:00.000Z');
  });

  it('should show event details after clicking on an event', () => {
    openDojoWithLatLong();
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventNames(0).click();
    EventDetailsPage.name.waitForVisible();
    expect(EventDetailsPage.name.getText()).to.equal('My First Amazing Event');

    EventDetailsPage.dateOfBirthInput.setValue('dob');
    EventDetailsPage.nextButton.click();

    expect(browser.getUrl()).to.have.string('/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
    EventSessionsPage.name.waitForVisible();
    expect(EventSessionsPage.name.getText()).to.equal('My First Amazing Event');
    expect(EventSessionsPage.eventSessions(0).getText()).to.have.string('Scratch');
    expect(EventSessionsPage.eventSessions(0).getText()).to.have.string('Beginners welcome');
    expect(EventSessionsPage.eventTickets(0).getText()).to.have.string('Laptop Required');
    expect(EventSessionsPage.eventTickets(1).getText()).to.have.string('Parent');
    expect(EventSessionsPage.eventTickets(2).getText()).to.have.string('Mentor');
    expect(EventSessionsPage.eventTickets(3).getText()).to.have.string('Bringing a laptop');

    expect(EventSessionsPage.eventSessions(1).getText()).to.have.string('Arduino');
    expect(EventSessionsPage.eventSessions(1).getText()).to.have.string('Intermediate');
    expect(EventSessionsPage.eventTickets(4).getText()).to.have.string('Laptop required');

    expect(EventSessionsPage.ticketCounterValues.length).to.equal(8);
    EventSessionsPage.ticketCounterValues.forEach((counterValue) => {
      expect(counterValue.getValue()).to.equal('0');
    });

    EventSessionsPage.ticketCounterIncrement(0).click();
    expect(EventSessionsPage.ticketCounterValue(0).getValue()).to.equal('1');

    EventSessionsPage.ticketCounterIncrement(2).click();
    EventSessionsPage.ticketCounterIncrement(2).click();
    expect(EventSessionsPage.ticketCounterValue(2).getValue()).to.equal('2');

    EventSessionsPage.ticketCounterDecrement(2).click();
    expect(EventSessionsPage.ticketCounterValue(2).getValue()).to.equal('1');
  });
});

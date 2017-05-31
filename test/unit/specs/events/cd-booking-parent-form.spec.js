import BookingParentFormComponent from '!!vue-loader?inject!@/events/cd-booking-parent-form';
import { pick } from 'lodash';

describe('Booking Parent Form', () => {
  it('should store parent data and navigate to confirmation page', () => {
    const MockStoreService = {
      save: sinon.spy(),
    };
    const BookingParentFormComponentWithMocks = BookingParentFormComponent({
      '@/store/store-service': MockStoreService,
    });

    const parentData = {
      eventId: 1,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1-555-123456',
      email: 'john.doe@example.com',
      $router: {
        push: sinon.spy(),
      },
    };

    BookingParentFormComponentWithMocks.methods.submitBooking.bind(parentData)();

    expect(MockStoreService.save).to.be.calledOnce;
    expect(MockStoreService.save).to.have.been.calledWith(`booking-${parentData.eventId}`, { parent: pick(parentData, ['firstName', 'lastName', 'phoneNumber', 'email']) });
    expect(parentData.$router.push).to.be.calledOnce;
    expect(parentData.$router.push).to.have.been.calledWith(`/events/${parentData.eventId}/create-account`);
  });
});
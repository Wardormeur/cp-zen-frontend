<template>
  <div class="cd-booking">
    <div class="cd-booking__attendee-heading">Attendee Information</div>
    <div class="cd-booking__ticket-box">

      <div class="cd-booking__header-container">
        <div class="cd-booking__selected-tickets-heading">Selected Tickets</div>
        <a class="cd-booking__modify" @click="$router.back()">Modify</a>
      </div>

      <div class="row cd-booking__tickets" v-for="ticket in tickets">
        <span class="col-md-4">
         {{ticket.selectedTickets.length}} x {{ ticket.selectedTickets[0].ticket.name }}
        </span>
        <span class="col-md-8">
          {{ ticket.session.name }}
        </span>
      </div>
    </div>
    <form>
      <bookingParentForm :eventId="eventId" :tickets="tickets" ref="bookingParentFormRef"></bookingParentForm>
      <bookingCreateAccount :eventId="eventId" ref="bookingCreateAccountRef"></bookingCreateAccount>
    </form>
    <input type="button" class="cd-booking__submit-button btn-primary" @click="onSubmit()" value="Confirm Booking"/>
  </div>
</template>
<script>
  import StoreService from '@/store/store-service';
  import BookingParentForm from '@/events/cd-booking-parent-form';
  import BookingCreateAccount from '@/events/cd-booking-create-account';

  export default {
    name: 'Booking',
    props: ['eventId'],
    components: {
      bookingParentForm: BookingParentForm,
      bookingCreateAccount: BookingCreateAccount,
    },
    data() {
      return {
        tickets: {},
      };
    },
    methods: {
      loadSessionData() {
        this.tickets = StoreService.load(`booking-${this.eventId}-sessions`);
      },
      onSubmit() {
        if (this.isValidChildForm()) {
          this.$refs.bookingParentFormRef.submitBooking();
          this.$refs.bookingCreateAccountRef.submitAccount()
            .then(() => {
              this.$router.push({ name: 'EventBookingConfirmation', params: { eventId: this.eventId } });
            });
        }
      },
      isValidChildForm() {
        if (!this.$refs.bookingCreateAccountRef.getRecaptchaResponse()) {
          // eslint-disable-next-line
          window.alert('Please complete the reCAPTCHA.');
          return false;
        }
        return this.$refs.bookingParentFormRef.isValid() &&
          this.$refs.bookingCreateAccountRef.isValid();
      },
    },
    created() {
      this.loadSessionData();
    },
  };
</script>
<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-booking {
    &__attendee-heading {
      margin-top: 45px;
      margin-bottom: 16px;
      font-size: 24px;
      font-weight: bold;
    }
    &__selected-tickets-heading {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 9px;
    }
    &__tickets{
      font-size: 16px;
      height: 30px
    }
    &__ticket-box {
      border-style: solid;
      border-color: @cd-orange;
      border-width: 1px 1px 3px 1px;
      padding: 16px;
      margin-right: 33px;
    }
    &__submit-button {
      margin-top: 48px;
      width: 200px;
      height: 50px;
      border-radius: 4px;
      font-size: 16px;
      border: none;
    }
    &__header-container{
      display: flex;
    }
    &__selected-tickets-heading {
       flex: 1;
    }
    &__modify {
      margin-right: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>

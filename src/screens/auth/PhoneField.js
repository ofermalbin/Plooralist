import { PhoneField as SuperPhoneField } from 'aws-amplify-react-native';

export default class PhoneField extends SuperPhoneField {
    constructor(props) {
        super(props);

        this.state = {
            dialCode: '+972',
            phone: '',
        };
    }
}

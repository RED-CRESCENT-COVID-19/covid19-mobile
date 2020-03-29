import React, { Component } from "react";
import { Text, StyleSheet, View, Keyboard, AsyncStorage } from "react-native";
import {connect} from 'react-redux'
import { OutlinedTextField } from "react-native-material-textfield";
import { RaisedTextButton } from "react-native-material-buttons";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
// plugins
import I18n from "../../plugins/I18n";

//Custom Components
import { Heading, CardView } from "../../components";

//Theme
import { Styles, Colors } from "../../../theme";

//Actions 
import * as actionCreators from '../../actions'
import MakeId from '../../utils/Makeid'

const WRITING_STYLE = I18n.locale;
 class HouseholdNumber extends Component {
  
  constructor(props) {
    super(props);
    this.state = { address: "", loader: false,is_contacted:false,id:'',lat:'',lng:'',token:'' };
  }
  fieldRef = React.createRef();
  handleContinue = () => {  
    const home = {
      address:this.state.address,
      id:this.state.id,
      lat:this.state.lat,
      lng:this.state.lng,
      is_contacted:0
    };
    console.log(this.props)
    const token = this.state.token;
    this.props.createHome(home,token)
   
    this.props.navigation.navigate("HouseHoldDetails");
  };
  handleBack = () => {
    this.props.navigation.goBack();
  };

  onBlur() {
    Keyboard.dismiss();
  }
  _getsetID = async () =>{
    // let hid = await AsyncStorage.getItem('HouseID'); 
    // if (hid !== null) {
      // this.setState({ id: hid });
    // }else {
      let newHouseId = await MakeId();
      await AsyncStorage.setItem('HouseID',newHouseId);
      this.setState({ id: newHouseId });
    // }
  }
   gettoken = async () =>{
    let token = await AsyncStorage.getItem('AuthToken'); 
    if (token !== null) {
      this.setState({ token: token });
    }
  } 
 
  _getLocationAsync = async () => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      await AsyncStorage.setItem("LocationStatus", status);
      if (status !== "granted") {
        this.setState({
          errorMessage: "Permission to access location was denied"
        });
      }
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    } catch (error) {
      Alert.alert(
        `${error}`,
        "Please head over to setting & enable the location",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    }
  };
  onSubmit = () => {
    let { current: field } = this.fieldRef;
    Keyboard.dismiss();
    this.setState({ address: field.value() });
  };
  componentDidMount(){
    this._getsetID();
    this._getLocationAsync();
    this.gettoken();
  }
  render() {
    const style = WRITING_STYLE === "ur" ? { writingDirection: "rtl" } : {};
    return (
      <View style={Styles.container}>
        <Heading headerText={I18n.t(`headings.HOUSEHOLDNUMBER`)} />
        <Text style={[Styles.topParagraph, style]}>
          {I18n.t(`Paragarphs.HOUSEHOLDNUMBER`)}
        </Text>

        <CardView Styles={Styles.Spacer50} />
        <OutlinedTextField
          label={I18n.t(`Paragarphs.HOUSEHOLDNUMBERADDRESS`)}
          placeholder={" "}
          tintColor={Colors.primaryColor}
          formatText={this.formatText}
          multiline
          returnKeyType={"done"}
          inputContainerStyle={screenStyles.inputContainerStyle}
          onSubmitEditing={this.onSubmit}
          onBlur={() => this.onBlur()}
          ref={this.fieldRef}
        />

        <Text style={screenStyles.centerText}>
          {I18n.t(`Paragarphs.HOUSEHOLDNUMBERQUESTION`)}
        </Text>

        <View style={Styles.buttonsContainer}>
          <RaisedTextButton
            title={I18n.t(`ButtonTitles.NO`)}
            color={Colors.secondaryColor}
            titleColor={Colors.buttonTextColor}
            shadeBorderRadius={1.5}
            style={Styles.smallButton}
            onPress={this.handleBack}
          />
          <RaisedTextButton
            title={I18n.t(`ButtonTitles.YES`)}
            color={Colors.primaryColor}
            titleColor={Colors.buttonTextColor}
            shadeBorderRadius={1.5}
            style={Styles.smallButton}
            onPress={this.handleContinue}
          />
        </View>
      </View>
    );
  }
}

const screenStyles = StyleSheet.create({
  textInput: {
    paddingTop: 20,
    paddingLeft: 35,
    paddingRight: 35
  },
  centerText: {
    paddingTop: 20,
    paddingLeft: 35,
    paddingRight: 35,
    textAlign: "center"
  },
  inputContainerStyle: {
    margin: 35
  }
});
const mapDispatchToProps = (dispatch) => {
  return {
    createHome:(home,token) => dispatch(actionCreators.createHome(home,token))
  }
}

const mapStateToProps = state => {
 return {...state}
    
}


export default connect(mapStateToProps,mapDispatchToProps)(HouseholdNumber)
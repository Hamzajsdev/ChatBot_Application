import React, { useState } from "react";

// Import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

// Firebase Storage to upload file
import storage from "@react-native-firebase/storage";
// To pick the file from local file system
import DocumentPicker from "react-native-document-picker";

const UploadDoc = () => {
    const [loading, setLoading] = useState(false);
    const [filePath, setFilePath] = useState({});
    const [process, setProcess] = useState("");

    const _chooseFile = async () => {
        try {
            const fileDetails = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log("fileDetails : " + JSON.stringify(fileDetails));
            setFilePath(fileDetails);
        } catch (error) {
            setFilePath({});
            alert(
                DocumentPicker.isCancel(error)
                    ? "Canceled"
                    : "Unknown Error: " + JSON.stringify(error)
            );
        }
    };
    
    const _uploadFile = async () => {
        try {
            if (Object.keys(filePath).length === 0 || !filePath.uri) {
                return alert("Please Select any File");
            }
            setLoading(true);
    
            const reference = storage().ref(`/myfiles/${filePath.name}`);
    
            const task = reference.putFile(filePath.uri);
    
            task.on("state_changed", (taskSnapshot) => {
                setProcess(
                    `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
                );
                console.log(
                    `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
                );
            });
    
            await task;
    
            alert("File uploaded to the bucket!");
            setProcess("");
            setFilePath({});
        } catch (error) {
            console.log("Error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
      
    
    
  return (
    <>
    {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.titleText}>
              Upload Input Text as File on FireStorage
            </Text>
            <View style={styles.container}>
              <Text>
                Choose File and Upload to FireStorage
              </Text>
              <Text>{process}</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={_chooseFile}
              >
                <Text style={styles.buttonTextStyle}>
                  Choose Image (Current Selected:{" "}
                  {Object.keys(filePath).length == 0
                    ? 0
                    : 1}
                  )
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={_uploadFile}
              >
                <Text style={styles.buttonTextStyle}>
                  Upload File on FireStorage
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.footerHeading}>
              React Native Firebase Cloud Storage
            </Text>
            <Text style={styles.footerText}>
              www.aboutreact.com
            </Text>
          </View>
        </SafeAreaView>
      )}
    </>
  )
}

export default UploadDoc

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      padding: 10,
    },
    titleText: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      padding: 20,
    },
    buttonStyle: {
      alignItems: "center",
      backgroundColor: "orange",
      padding: 10,
      width: 300,
      marginTop: 16,
    },
    buttonTextStyle: {
      color: "white",
      fontWeight: "bold",
    },
    footerHeading: {
      fontSize: 18,
      textAlign: "center",
      color: "grey",
    },
    footerText: {
      fontSize: 16,
      textAlign: "center",
      color: "grey",
    },
  });
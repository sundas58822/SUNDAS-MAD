import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

// ========== VERSION 1: FORM THROUGH PROPS ==========
const Version1_PropsMethod = ({ visible, onClose }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    rating: Yup.number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .required("Rating is required"),
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Version 1: Props Method</Text>
          <Text style={styles.subtitle}>Using props object directly</Text>

          <Formik
            initialValues={{ name: "", email: "", rating: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              Alert.alert("Success", `Name: ${values.name}\nEmail: ${values.email}\nRating: ${values.rating}`);
              onClose();
            }}
          >
            {(props) => (
              <ScrollView>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={[styles.input, props.touched.name && props.errors.name && styles.inputError]}
                  placeholder="Enter your name"
                  onChangeText={props.handleChange("name")}
                  onBlur={props.handleBlur("name")}
                  value={props.values.name}
                />
                {props.touched.name && props.errors.name && (
                  <Text style={styles.error}>{props.errors.name}</Text>
                )}

                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={[styles.input, props.touched.email && props.errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  onChangeText={props.handleChange("email")}
                  onBlur={props.handleBlur("email")}
                  value={props.values.email}
                  keyboardType="email-address"
                />
                {props.touched.email && props.errors.email && (
                  <Text style={styles.error}>{props.errors.email}</Text>
                )}

                <Text style={styles.label}>Rating (1-5):</Text>
                <TextInput
                  style={[styles.input, props.touched.rating && props.errors.rating && styles.inputError]}
                  placeholder="Enter rating"
                  onChangeText={props.handleChange("rating")}
                  onBlur={props.handleBlur("rating")}
                  value={props.values.rating}
                  keyboardType="numeric"
                />
                {props.touched.rating && props.errors.rating && (
                  <Text style={styles.error}>{props.errors.rating}</Text>
                )}

                <View style={styles.buttonGroup}>
                  <Button title="Submit" onPress={props.handleSubmit} />
                  <Button title="Close" onPress={onClose} color="red" />
                </View>
              </ScrollView>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

// ========== VERSION 2: FORM THROUGH DESTRUCTURE ==========
const Version2_DestructureMethod = ({ visible, onClose }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    rating: Yup.number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .required("Rating is required"),
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Version 2: Destructure Method</Text>
          <Text style={styles.subtitle}>Using destructuring for cleaner code</Text>

          <Formik
            initialValues={{ name: "", email: "", rating: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              Alert.alert("Success", `Name: ${values.name}\nEmail: ${values.email}\nRating: ${values.rating}`);
              onClose();
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <ScrollView>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={[styles.input, touched.name && errors.name && styles.inputError]}
                  placeholder="Enter your name"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
                {touched.name && errors.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}

                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={[styles.input, touched.email && errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <Text style={styles.label}>Rating (1-5):</Text>
                <TextInput
                  style={[styles.input, touched.rating && errors.rating && styles.inputError]}
                  placeholder="Enter rating"
                  onChangeText={handleChange("rating")}
                  onBlur={handleBlur("rating")}
                  value={values.rating}
                  keyboardType="numeric"
                />
                {touched.rating && errors.rating && (
                  <Text style={styles.error}>{errors.rating}</Text>
                )}

                <View style={styles.buttonGroup}>
                  <Button title="Submit" onPress={handleSubmit} />
                  <Button title="Close" onPress={onClose} color="red" />
                </View>
              </ScrollView>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

// ========== VERSION 3: COMPLETE REVIEW FORM ==========
const Version3_CompleteReviewForm = ({ visible, onClose }) => {
  const reviewSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .required("Title is required"),
    body: Yup.string()
      .min(10, "Review must be at least 10 characters")
      .required("Review body is required"),
    rating: Yup.number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .required("Rating is required"),
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { maxHeight: "85%" }]}>
          <Text style={styles.modalTitle}>Version 3: Complete Review Form</Text>
          <Text style={styles.subtitle}>Full featured form with text area</Text>

          <Formik
            initialValues={{ title: "", body: "", rating: "" }}
            validationSchema={reviewSchema}
            onSubmit={(values, { resetForm }) => {
              Alert.alert(
                "Review Submitted",
                `Title: ${values.title}\nRating: ${values.rating}/5\n\nReview: ${values.body}`
              );
              resetForm();
              onClose();
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Review Title:</Text>
                <TextInput
                  style={[styles.input, touched.title && errors.title && styles.inputError]}
                  placeholder="e.g., Amazing App!"
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                  value={values.title}
                />
                {touched.title && errors.title && (
                  <Text style={styles.error}>{errors.title}</Text>
                )}

                <Text style={styles.label}>Your Review:</Text>
                <TextInput
                  style={[styles.textArea, touched.body && errors.body && styles.inputError]}
                  placeholder="Write your detailed review here..."
                  onChangeText={handleChange("body")}
                  onBlur={handleBlur("body")}
                  value={values.body}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {touched.body && errors.body && (
                  <Text style={styles.error}>{errors.body}</Text>
                )}

                <Text style={styles.label}>Rating (1-5):</Text>
                <TextInput
                  style={[styles.input, touched.rating && errors.rating && styles.inputError]}
                  placeholder="Enter rating from 1 to 5"
                  onChangeText={handleChange("rating")}
                  onBlur={handleBlur("rating")}
                  value={values.rating}
                  keyboardType="numeric"
                  maxLength={1}
                />
                {touched.rating && errors.rating && (
                  <Text style={styles.error}>{errors.rating}</Text>
                )}

                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.submitButton, !isValid && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={!isValid}
                  >
                    <Text style={styles.submitButtonText}>Submit Review</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

// ========== MAIN APP COMPONENT ==========
export default function App() {
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>📱 Modal + Formik Demo</Text>
        <Text style={styles.headerSubtitle}>3 Different Implementation Methods</Text>

        {/* Version 1 Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.versionBadge}>Version 1</Text>
            <Text style={styles.cardTitle}>Props Method</Text>
          </View>
          <Text style={styles.cardDescription}>
            Using props object - Access everything through props parameter
          </Text>
          <TouchableOpacity
            style={[styles.openButton, { backgroundColor: "#3498db" }]}
            onPress={() => setModal1Visible(true)}
          >
            <Text style={styles.openButtonText}>Open Version 1</Text>
          </TouchableOpacity>
        </View>

        {/* Version 2 Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.versionBadge}>Version 2</Text>
            <Text style={styles.cardTitle}>Destructure Method</Text>
          </View>
          <Text style={styles.cardDescription}>
            Using destructuring - Cleaner and more readable code
          </Text>
          <TouchableOpacity
            style={[styles.openButton, { backgroundColor: "#2ecc71" }]}
            onPress={() => setModal2Visible(true)}
          >
            <Text style={styles.openButtonText}>Open Version 2</Text>
          </TouchableOpacity>
        </View>

        {/* Version 3 Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.versionBadge}>Version 3</Text>
            <Text style={styles.cardTitle}>Complete Review Form</Text>
          </View>
          <Text style={styles.cardDescription}>
            Full featured form with multi-line input, validation, and disabled state
          </Text>
          <TouchableOpacity
            style={[styles.openButton, { backgroundColor: "#e74c3c" }]}
            onPress={() => setModal3Visible(true)}
          >
            <Text style={styles.openButtonText}>Open Version 3</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📚 Lecture Notes:</Text>
          <Text style={styles.infoText}>• Modal uses useState to control visibility</Text>
          <Text style={styles.infoText}>• Formik manages form state and validation</Text>
          <Text style={styles.infoText}>• Yup provides schema-based validation</Text>
          <Text style={styles.infoText}>• handleChange updates values, handleSubmit processes form</Text>
        </View>
      </ScrollView>

      {/* Render All Three Modals */}
      <Version1_PropsMethod visible={modal1Visible} onClose={() => setModal1Visible(false)} />
      <Version2_DestructureMethod visible={modal2Visible} onClose={() => setModal2Visible(false)} />
      <Version3_CompleteReviewForm visible={modal3Visible} onClose={() => setModal3Visible(false)} />
    </SafeAreaView>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  versionBadge: {
    backgroundColor: "#007AFF",
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  openButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  openButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "#e8f4f8",
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2980b9",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    minHeight: 100,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
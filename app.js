// ARKRAY AI CALL ANALYZER - MOBILE APP VERSION (REACT NATIVE)

// ================= STACK ================= // React Native (Expo) + Existing Backend API

// ================= SETUP ================= // 1. Install Expo // npx create-expo-app call-analyzer-app // cd call-analyzer-app // npm install axios expo-av

// ================= APP CODE ================= // File: App.js

import React, { useState } from "react"; import { View, Text, Button, TextInput, ScrollView } from "react-native"; import * as DocumentPicker from "expo-document-picker"; import { Audio } from "expo-av"; import axios from "axios";

export default function App() { const [audio, setAudio] = useState(null); const [recording, setRecording] = useState(null); const [analysis, setAnalysis] = useState(null); const [agent, setAgent] = useState(""); const [product, setProduct] = useState("Glucometer");

const pickAudio = async () => { const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" }); if (result.assets) setAudio(result.assets[0]); };

const startRecording = async () => { const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY ); setRecording(recording); };

const stopRecording = async () => { await recording.stopAndUnloadAsync(); const uri = recording.getURI(); setAudio({ uri, name: "recording.m4a", type: "audio/m4a" }); };

const analyze = async () => { if (!audio) return alert("Upload or record audio");

const formData = new FormData();
formData.append("file", {
  uri: audio.uri,
  name: audio.name,
  type: audio.mimeType || "audio/m4a",
});

formData.append("agent", agent);
formData.append("product", product);

const res = await axios.post("http://YOUR_SERVER_URL/api/analyze", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

setAnalysis(res.data);

};

return ( <ScrollView style={{ padding: 20 }}> <Text style={{ fontSize: 22, fontWeight: "bold" }}> ARKRAY Call Analyzer </Text>

<TextInput
    placeholder="Agent Name"
    value={agent}
    onChangeText={setAgent}
    style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
  />

  <Button title="Upload Audio" onPress={pickAudio} />

  <View style={{ marginVertical: 10 }}>
    <Button title="Start Recording" onPress={startRecording} />
    <Button title="Stop Recording" onPress={stopRecording} />
  </View>

  <Button title="Analyze Call" onPress={analyze} />

  {analysis && (
    <View style={{ marginTop: 20 }}>
      <Text>Score: {analysis.score?.overall}</Text>
      <Text>Opening: {analysis.score?.opening}</Text>
      <Text>Closing: {analysis.score?.closing}</Text>
      <Text>Tone: {analysis.tone?.confidence}</Text>
      <Text>Lead: {analysis.leadType}</Text>

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Suggestions:
      </Text>
      {analysis.autoSuggestions?.map((s, i) => (
        <Text key={i}>- {s}</Text>
      ))}
    </View>
  )}
</ScrollView>

); }

// ================= IMPORTANT =================

// Replace: // http://YOUR_SERVER_URL // with your deployed backend URL

// ================= BUILD APK ================= // npx expo build:android

// or // npx expo run:android

// ================= WHAT YOU NOW HAVE =================

// ✅ Mobile app for sales team // ✅ Upload or record calls instantly // ✅ AI analysis in seconds // ✅ Works anywhere (field sales ready)

// ================= NEXT LEVEL =================

// Add: // - Login (Firebase Auth) // - Push notifications (analysis ready) // - Offline recording + sync

// ================= DONE ================= // Your team can now use this daily on mobile

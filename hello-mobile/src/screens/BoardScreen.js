import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import socket from '../utils/socket';

export default function BoardScreen() {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [remotePaths, setRemotePaths] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  
  // State untuk me-render ulang SVG saat layar diputar/berubah ukuran
  const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });
  
  // Ref untuk dimensi agar terbaca akurat oleh PanResponder tanpa delay
  const dimensionsRef = useRef({ width: 1, height: 1 });
  const activePath = useRef([]);
  const sessionId = useRef(Math.random().toString(36).substring(7)).current;

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('receive-trace', (data) => {
      const { userId, pathData, isFinished } = data;
      if (userId === sessionId) return;

      if (isFinished) {
        setPaths(prev => [...prev, pathData]);
        setRemotePaths(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      } else {
        setRemotePaths(prev => ({ ...prev, [userId]: pathData }));
      }
    });

    socket.on('receive-clear', () => {
      setPaths([]);
      setRemotePaths({});
    });

    return () => socket.disconnect();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { width, height } = dimensionsRef.current;
        const { locationX, locationY } = evt.nativeEvent;
        
        // Kalkulasi persentase koordinat (0.0 hingga 1.0)
        const relX = locationX / width;
        const relY = locationY / height;
        
        activePath.current = [{ cmd: 'M', x: relX, y: relY }];
        const pathCopy = [...activePath.current];
        
        setCurrentPath(pathCopy); 
        socket.emit('send-trace', { userId: sessionId, pathData: pathCopy, isFinished: false });
      },
      onPanResponderMove: (evt) => {
        const { width, height } = dimensionsRef.current;
        const { locationX, locationY } = evt.nativeEvent;
        
        const relX = locationX / width;
        const relY = locationY / height;
        
        if (activePath.current.length === 0) {
          activePath.current = [{ cmd: 'M', x: relX, y: relY }];
        } else {
          activePath.current.push({ cmd: 'L', x: relX, y: relY });
        }
        
        const pathCopy = [...activePath.current];
        
        setCurrentPath(pathCopy);
        socket.emit('send-trace', { userId: sessionId, pathData: pathCopy, isFinished: false });
      },
      onPanResponderRelease: () => {
        if (activePath.current.length > 0) {
          const finishedPath = [...activePath.current];
          
          setPaths(prev => [...prev, finishedPath]);
          socket.emit('send-trace', { userId: sessionId, pathData: finishedPath, isFinished: true });
          
          activePath.current = [];
          setCurrentPath([]);
        }
      },
    })
  ).current;

  // Fungsi konversi dari koordinat relatif kembali ke piksel absolut sesuai layar perangkat
  const renderPath = (pathArray) => {
    if (!pathArray || pathArray.length === 0) return '';
    return pathArray.map(pt => {
      const absX = pt.x * canvasSize.width;
      const absY = pt.y * canvasSize.height;
      return `${pt.cmd}${absX},${absY}`;
    }).join(' ');
  };

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    dimensionsRef.current = { width, height };
    setCanvasSize({ width, height });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusContainer, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]}>
        <Text style={styles.statusText}>
          Status: {isConnected ? 'Terhubung ke Server' : 'Terputus (Cek Jaringan/IP)'}
        </Text>
      </View>

      <View 
        style={styles.canvasContainer} 
        onLayout={handleLayout} // Mengambil dimensi layar yang presisi saat dirender
        {...panResponder.panHandlers}
      >
        <Svg style={styles.svg}>
          {paths.map((p, i) => <Path key={`finished-${i}`} d={renderPath(p)} stroke="black" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
          
          {currentPath.length > 0 && <Path d={renderPath(currentPath)} stroke="black" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          
          {Object.keys(remotePaths).map(id => <Path key={`remote-${id}`} d={renderPath(remotePaths[id])} stroke="black" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
        </Svg>
      </View>
      
      <TouchableOpacity style={styles.clearButton} onPress={() => { setPaths([]); activePath.current = []; setCurrentPath([]); socket.emit('send-clear'); }}>
        <Text style={styles.clearText}>Bersihkan Canvas Bersama</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  statusContainer: { padding: 10, alignItems: 'center' },
  statusText: { color: 'white', fontWeight: 'bold' },
  canvasContainer: { flex: 1, backgroundColor: '#fff', margin: 10, borderRadius: 10, overflow: 'hidden' },
  svg: { flex: 1 },
  clearButton: { backgroundColor: '#ff4444', padding: 15, margin: 10, borderRadius: 8, alignItems: 'center' },
  clearText: { color: 'white', fontWeight: 'bold' }
});
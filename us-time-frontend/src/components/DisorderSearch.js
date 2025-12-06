import React, { useState, useEffect } from 'react';
import { disorderService } from '../services/api';
import './DisorderSearch.css';

const DisorderSearch = () => {
  const [disorders, setDisorders] = useState([]);
  const [filteredDisorders, setFilteredDisorders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisorder, setSelectedDisorder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load disorders on component mount
  useEffect(() => {
    loadDisorders();
  }, []);

  const loadDisorders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await disorderService.getAllDisorders();
      setDisorders(data);
      setFilteredDisorders(data);
    } catch (err) {
      console.error('Error loading disorders:', err);
      setError('Failed to load disorders. Please try again later.');
      
      // Fallback data
      setDisorders([
        {
          id: 1,
          name: 'Depression',
          description: 'A mental health disorder characterized by persistent sadness and loss of interest.',
          symptoms: 'Sadness, fatigue, sleep changes, appetite changes',
          remedies: ['Therapy', 'Medication', 'Exercise', 'Support groups']
        },
        {
          id: 2,
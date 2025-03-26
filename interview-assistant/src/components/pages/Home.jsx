/* interview-sessions.css - Custom styling for the Interview Sessions page */

/* General animations */
@keyframes gradientBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* Animation classes */
.animate-fadeIn {
  animation: fadeIn 0.8s ease forwards;
}

.animate-slideUp {
  animation: slideUp 0.5s ease forwards;
}

.animate-bounceIn {
  animation: bounceIn 0.6s ease forwards;
}

.animate-zoomIn {
  animation: zoomIn 0.3s ease forwards;
}

/* Error message styles */
.error-message {
  background: #FEE2E2;
  border-left: 4px solid #DC2626;
  color: #991B1B;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  animation: fadeIn 0.5s ease-out;
}

.error-message i {
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.error-message-text {
  flex: 1;
}

.error-message button {
  margin-left: auto;
  background: transparent;
  border: none;
  color: #991B1B;
  cursor: pointer;
  transition: all 0.2s;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.error-message button:hover {
  color: #7F1D1D;
  background: rgba(255, 255, 255, 0.5);
}

/* Filter container styles */
.filter-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.filter-container:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.filter-label {
  font-weight: 600;
  color: #374151;
  margin-right: 1rem;
}

.filter-button {
  padding: 0.5rem 1rem;
  border: 1px solid #E5E7EB;
  background: white;
  color: #4B5563;
  font-weight: 500;
  transition: all 0.2s;
}

.filter-button:first-of-type {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.filter-button:last-of-type {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.filter-button.active {
  background: #5E60CE;
  border-color: #5E60CE;
  color: white;
}

.filter-button:hover:not(.active) {
  background: #F3F4F6;
}

/* Search container styles */
.search-container {
  position: relative;
  max-width: 20rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background: #F9FAFB;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #5E60CE;
  outline: none;
  box-shadow: 0 0 0 3px rgba(94, 96, 206, 0.1);
  background: white;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.clear-search:hover {
  color: #4B5563;
  background: #F3F4F6;
}

/* Loading container styles */
.loading-container {
  text-align: center;
  padding: 5rem 2rem;
  animation: fadeIn 0.8s ease-out;
}

.loading-spinner {
  display: inline-block;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 4px solid #E5E7EB;
  border-top-color: #5E60CE;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

.loading-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.loading-subtext {
  color: #6B7280;
}

/* Empty state styles */
.empty-state {
  background: white;
  border-radius: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.8s ease-out;
}

.empty-state-icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-state-icon {
  font-size: 3rem;
  color: #D1D5DB;
  margin-bottom: 1rem;
}

.empty-state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.75rem;
}

.empty-state-message {
  color: #6B7280;
  max-width: 24rem;
  margin: 0 auto 1.5rem;
}

.empty-state-button {
  display: inline-flex;
  align-items: center;
  background: #5E60CE;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.empty-state-button:hover {
  background: #4F46E5;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Interview card styles */
.interview-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease forwards;
  transform: translateY(0);
}

.interview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.interview-card-header {
  background: linear-gradient(90deg, #5E60CE, #5390D9);
  color: white;
  padding: 1.25rem;
  position: relative;
}

.interview-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.interview-card-subtitle {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  opacity: 0.9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-button {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 10;
  min-width: 12rem;
  margin-top: 0.5rem;
  border: 1px solid #E5E7EB;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.dropdown-item-delete {
  color: #DC2626;
}

.dropdown-item-delete:hover {
  background: #FEF2F2;
}

.interview-card-body {
  padding: 1.25rem;
}

.interview-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.interview-card-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.interview-card-tag-date {
  background: #EFF6FF;
  color: #1E40AF;
  border: 1px solid #DBEAFE;
}

.interview-card-tag-questions {
  background: #F5F3FF;
  color: #5B21B6;
  border: 1px solid #EDE9FE;
}

.interview-card-tag-language {
  background: #ECFDF5;
  color: #065F46;
  border: 1px solid #D1FAE5;
}

.interview-card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.interview-card-stat {
  background: #F9FAFB;
  border: 1px solid #F3F4F6;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: border-color 0.2s;
}

.interview-card-stat:hover {
  border-color: #E5E7EB;
}

.interview-card-stat-label {
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
}

.interview-card-stat-value {
  font-weight: 500;
  color: #111827;
  display: flex;
  align-items: center;
}

.interview-card-stat-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.interview-card-stat-dot-completed {
  background: #10B981;
}

.interview-card-stat-dot-progress {
  background: #F59E0B;
}

.interview-card-stat-text-completed {
  color: #059669;
}

.interview-card-stat-text-progress {
  color: #D97706;
}

.interview-card-kbd {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-family: monospace;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.interview-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.interview-card-action-summary,
.interview-card-action-review {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.interview-card-action-summary {
  background: #F3F4F6;
  color: #374151;
}

.interview-card-action-summary:hover:not(:disabled) {
  background: #E5E7EB;
}

.interview-card-action-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #F3F4F6;
  color: #9CA3AF;
}

.interview-card-action-review {
  background: #5E60CE;
  color: white;
}

.interview-card-action-review:hover {
  background: #4F46E5;
}

/* Fixed action button */
.fixed-action-button {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;
}

.fixed-action-button-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #5E60CE;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.fixed-action-button-link:hover {
  transform: scale(1.1) rotate(45deg);
  background: #4F46E5;
}

.fixed-action-button-link i {
  font-size: 1.5rem;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.modal-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 100%;
  padding: 1rem;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  transition: opacity 0.3s ease-out;
}

.modal-content {
  position: relative;
  display: inline-block;
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  text-align: left;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: translateY(0);
  z-index: 10;
  max-width: 28rem;
  width: 100%;
  animation: zoomIn 0.3s ease-out;
}

.modal-body {
  display: flex;
  padding: 1.5rem;
}

.modal-icon-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #FEE2E2;
  margin-right: 1rem;
}

.modal-icon {
  color: #DC2626;
  font-size: 1.25rem;
}

.modal-text-container {
  flex: 1;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.modal-description {
  color: #4B5563;
  font-size: 0.875rem;
}

.modal-company-name {
  font-weight: 600;
  color: #111827;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  background-color: #F9FAFB;
  border-top: 1px solid #F3F4F6;
}

.modal-button-delete,
.modal-button-cancel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.modal-button-delete {
  background-color: #DC2626;
  color: white;
  margin-left: 0.75rem;
  border: none;
}

.modal-button-delete:hover {
  background-color: #B91C1C;
}

.modal-button-cancel {
  background-color: white;
  color: #4B5563;
  border: 1px solid #D1D5DB;
}

.modal-button-cancel:hover {
  background-color: #F9FAFB;
  color: #111827;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-container {
    padding: 1rem;
  }
  
  .interview-card-stats {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    max-width: 90%;
  }
  
  .modal-body {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .modal-icon-container {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}

@media (max-width: 640px) {
  .filter-label {
    margin-bottom: 0.5rem;
  }
  
  .empty-state {
    padding: 3rem 1.5rem;
  }
  
  .fixed-action-button-link {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .modal-footer {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  
  .modal-button-delete,
  .modal-button-cancel {
    width: 100%;
    margin-left: 0;
  }
}

/* Custom form elements */
input[type="text"]:focus,
input[type="search"]:focus {
  box-shadow: 0 0 0 3px rgba(94, 96, 206, 0.2);
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .interview-card {
    background: #1F2937;
  }
  
  .interview-card-body {
    color: #F9FAFB;
  }
  
  .interview-card-stat {
    background: #374151;
    border-color: #4B5563;
  }
  
  .interview-card-stat-label {
    color: #9CA3AF;
  }
  
  .interview-card-stat-value {
    color: #F9FAFB;
  }
  
  .interview-card-kbd {
    background: #374151;
    border-color: #4B5563;
    color: #F9FAFB;
  }
  
  .filter-container,
  .empty-state,
  .modal-content {
    background: #1F2937;
    color: #F9FAFB;
  }
  
  .filter-button {
    background: #374151;
    border-color: #4B5563;
    color: #E5E7EB;
  }
  
  .filter-button.active {
    background: #5E60CE;
    border-color: #5E60CE;
  }
  
  .filter-button:hover:not(.active) {
    background: #4B5563;
  }
  
  .search-input {
    background: #374151;
    border-color: #4B5563;
    color: #F9FAFB;
  }
  
  .search-input::placeholder {
    color: #9CA3AF;
  }
  
  .modal-footer {
    background: #111827;
    border-color: #374151;
  }
  
  .modal-title {
    color: #F9FAFB;
  }
  
  .modal-description {
    color: #D1D5DB;
  }
  
  .modal-button-cancel {
    background: #374151;
    border-color: #4B5563;
    color: #E5E7EB;
  }
  
  .modal-button-cancel:hover {
    background: #4B5563;
    color: #F9FAFB;
  }
}
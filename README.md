# HCMUT Smart Printing Service System (HCMUT-SSPS)

A smart printing service system designed for HCMUT students and staff, providing convenient and efficient printing solutions across campus.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Modelling](#system-modelling)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [Version Control Guidelines](#version-control-guidelines)
- [Contributors](#contributors)

## Overview
HCMUT-SSPS is a comprehensive printing management system that integrates multiple network printers across various campus buildings. The system enables students to upload documents, manage print jobs, and monitor their printing quotas through web and mobile interfaces.

## Features
- [ ] **User Authentication**: Secure login through HCMUT Single Sign-On (SSO)
- [ ] **Document Managemen**:
    - [ ] Upload and manage print documents
    - [ ] Support for multiple file formats
    - [ ] Print job customization options
- [ ] **Printer Network**:
    - [ ] Multiple printer locations across campus
    - [ ] Real-time printer status monitoring
    - [ ] Smart printer selection
- [ ] **Balance Management**:
    - [ ] Print quota tracking
    - [ ] Online page purchase through BKPay
    - [ ] Transaction history
- [ ] **Administrative Tools**:
    - [ ] Printer configuration management
    - [ ] Usage reporting and analytics
    - [ ] System settings control

## System Modelling
### 1. Use Case Diagram
The system's use case diagram illustrates the interactions between three main actors:
- Students
- Student Printing Service Officer (SPSO)
- IT Administration
#### Key use cases:
##### 1. For students:
- Submit Print Job
- Authenticate via HCMUT_SSO
- Manage Print Balance
- View Print History
- Purchase Additional Pages
##### 2. For SPSO:
- Configure System Settings
- Manage Printers
- Generate Reports
- Monitor Print Logs
##### 3. For IT Administration:
- Manage System Integration
- Manage system performance
### 2. Activity Diagram
The activity diagram shows the workflow for the printing process:
#### Main Flow:
1. User navigation:
    - Upload new document
    - Choose existing documents
2. Document Processing:
    - File type verification
    - Configuration Selection
    - Balancing Checking
3. Printing Process
    - Page Deduction
    - Print job submission
    - Status monitoring

### 3. Sequence Diagram(Abstraction)
The sequence diagram illustrates the interactions between:
- PrintServiceView (PSV)
- PrintServiceController (PSC)
- Database
- Printer Service Model

![alt text](./img/sequence_diagram_SE.drawio%20(1).png)

### 4. Class Diagram

![alt text](./img/uml.png)


## System Architecture
The system follows the Model-View-Controller (MVC) architecture:
- **Model**: Handles data management and business logic
- **View**: Manages user interface and presentation
- **Controller**: Processes user input and system responses

## Database Schema
- [Link to the schema](./backend/docs/print_hcmut.sql)
- [Link to the design of relational database](./backend/docs/SE_DB.drawio)


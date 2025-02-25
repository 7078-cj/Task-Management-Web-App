
# **Task Management Web App - Documentation**  


---
![image](https://github.com/user-attachments/assets/8c7fff0b-2ce4-4351-986e-682b28b04a67)
![image](https://github.com/user-attachments/assets/7779a7c9-0640-453f-9d9f-3c0498525ccc)
![image](https://github.com/user-attachments/assets/9d8cd3c5-81ac-4c5c-9537-9a6aee610038)




## **Overview**  
The **Task Management Web App** is a Django-based application designed to help users efficiently manage tasks, and track progress. It includes **a frontend and a backend** for seamless user interaction.  

---

## **Features**  
✔️ User authentication (Login, Registration)  
✔️ Task creation, updating, and deletion  
✔️ Task categorization  
✔️ Task status tracking (Pending, In Progress, Completed)  
✔️ User-friendly **frontend UI**  
✔️ API endpoints for task management

---

## **Installation Guide**  
### **1. Clone the Repository**  
```sh
git clone https://github.com/7078-cj/Task-Management-Web-App.git
cd Task-Management-Web-App
```

### **2. Create a Virtual Environment (Optional but Recommended)**  
```sh
python -m venv venv
source venv/bin/activate   # On macOS/Linux
venv\Scripts\activate      # On Windows
```

### **3. Install Dependencies**  
```sh
pip install -r requirements.txt
```

### **4. Configure the Database**  
Run migrations:  
```sh
python manage.py migrate
```

### **5. Create a Superuser (Admin Panel Access)**  
```sh
python manage.py createsuperuser
```
Follow the prompts to set up admin credentials.

### **6. Run the Server**  
```sh
python manage.py runserver
```

---

## **Accessing the Frontend**  

### **Separate Frontend (React,)**
1. Navigate to the frontend directory:  
   ```sh
   cd frontend
   ```
2. Install dependencies (for React, for example):  
   ```sh
   npm install
   ```
3. Start the frontend server:  
   ```sh
   npm run dev
   ```
4. Open your browser and visit: **http://localhost:3000/** (or the port configured in your frontend).  
5. Ensure the frontend is correctly connected to the Django backend via **API endpoints** in `settings.py` or `frontend/.env`.  

---

## **Usage Guide**  
1. **Sign up or log in** to your account.  
2. **Create new tasks**
3. **Update task status** as you progress.  
4. **View tasks** in a clean, categorized layout.  
---




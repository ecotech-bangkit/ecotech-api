const request = require('supertest');
const app = require('../index');
const connection = require('../configs/database');
const userModel = require('../models/userModel');

describe('User API', () => {
  jest.useFakeTimers();
  beforeAll(async () => {
    // Persiapkan kondisi awal atau mocking yang diperlukan sebelum menjalankan test case
    // Contoh: Mengosongkan atau mengisi tabel pengguna di database
    await userModel.deleteAllUsers();
  });

  afterAll(async () => {
    // Bersihkan atau hapus kondisi yang dibuat selama pengujian
    // Contoh: Menghapus pengguna yang ditambahkan ke database
    await userModel.deleteAllUsers();
    await connection.close();
  });

  describe('GET /v1/users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ];
      userModel.getAllUsers = jest.fn().mockResolvedValue(mockUsers);

      const response = await request(app).get('/v1/users');
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUsers);

      done();
    });
  });

  describe('POST /v1/users/register', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/v1/users/register').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', newUser.name);
      expect(response.body.data).toHaveProperty('email', newUser.email);

      // Lakukan pengecekan lebih lanjut jika diperlukan, misalnya:
      // - Memeriksa apakah pengguna telah ditambahkan ke database
      // - Memeriksa apakah password pengguna telah di-hash dengan benar
    });
  });

  // Tambahkan test case lain sesuai kebutuhan Anda
});

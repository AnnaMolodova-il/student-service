/*
The Arrange, Act, Assert (AAA) pattern in TDD unit testing involves three steps:
Arrange (setting up the test environment),
Act (executing the code under test),
and Assert (verifying the expected outcome).
This pattern helps in writing clear, maintainable, and predictable test cases.
 */

import {jest, beforeEach, describe, it, expect} from '@jest/globals';
import {
    countStudentsByNames,
    deleteStudent,
    findStudentById, findStudentsByMinScore,
    findStudentsByName,
    updateStudent
} from "../repository/studentRepository.js";

const mockRepo = {
    createStudent: jest.fn(),
    findStudentById: jest.fn(),
    deleteStudent: jest.fn(),
    updateStudent: jest.fn(),
    findStudentsByName: jest.fn(),
    countStudentsByNames: jest.fn(),
    findStudentsByMinScore: jest.fn()
}

jest.unstable_mockModule("../repository/studentRepository.js", () => mockRepo);

const studentService = await import("../service/studentService.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Student Service', () => {
    it('addStudent returns false when student already exists', async () => {
        // Arrange
        mockRepo.findStudentById.mockResolvedValue({id: 1});
        // Act
        const result = await studentService.addStudent({
            id: 1,
            name: 'John',
            password: 'secret'
        })
        // Assert
        expect(result).toBeFalsy();
        expect(mockRepo.createStudent).not.toHaveBeenCalled();
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(1);
    })
    it('addStudent returns true when student does not exists', async () => {
        // Arrange
        mockRepo.findStudentById.mockResolvedValue(null);
        // Act
        const result = await studentService.addStudent({
            id: 2,
            name: 'John',
            password: 'secret'
        })
        // Assert
        expect(result).toBeTruthy();
        expect(mockRepo.createStudent).toHaveBeenCalledWith({
            _id: 2,
            name: 'John',
            password: 'secret'
        });
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(2);
    })

    //---HW---

    it('findStudent returns student when student exists', async () => {
        // Arrange
        const student = {id: 1, name: 'John'};
        mockRepo.findStudentById.mockResolvedValue(student);
        // Act
        const result = await studentService.findStudent('1');
        // Assert
        expect(result).toEqual(student);
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(1);
    });

    it('findStudent returns null when student does not exist', async () => {
        // Arrange
        mockRepo.findStudentById.mockResolvedValue(null);
        // Act
        const result = await studentService.findStudent('5');
        // Assert
        expect(result).toBeNull();
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(5);
    });

    it('deleteStudent returns deleted student', async () => {
        // Arrange
        const student = {id: 1, name: 'John'};
        mockRepo.deleteStudent.mockResolvedValue(student);
        // Act
        const result = await studentService.deleteStudent('1');
        // Assert
        expect(result).toEqual(student);
        expect(mockRepo.deleteStudent).toHaveBeenCalledWith(1);
    });

    it('deleteStudent returns null when student does not exist', async () => {
        // Arrange
        mockRepo.deleteStudent.mockResolvedValue(null);
        // Act
        const result = await studentService.deleteStudent('5');
        // Assert
        expect(result).toBeNull();
        expect(mockRepo.deleteStudent).toHaveBeenCalledWith(5);
    });

    it('updateStudent returns updated student', async () => {
        // Arrange
        const data = {name: 'Mike'};
        const updatedStudent = {id: 1, name: 'Mike'};
        mockRepo.updateStudent.mockResolvedValue({
            toObject: () => updatedStudent
        });
        // Act
        const result = await studentService.updateStudent('1', data);
        // Assert
        expect(result).toEqual(updatedStudent);
        expect(mockRepo.updateStudent).toHaveBeenCalledWith(1, data);
    });

    it('addScore returns updated student', async () => {
        // Arrange
        const updatedStudent = {id: 1, name: 'John'};
        mockRepo.updateStudent.mockResolvedValue(updatedStudent);
        // Act
        const result = await studentService.addScore('1', 'math', 95);
        // Assert
        expect(result).toEqual(updatedStudent);
        expect(mockRepo.updateStudent).toHaveBeenCalledWith(
            1,
            {'scores.math': 95}
        );
    });

    it('findStudentsByName returns students', async () => {
        // Arrange
        const students = [
            {id: 1, name: 'John'},
            {id: 2, name: 'John'}
        ];
        mockRepo.findStudentsByName.mockResolvedValue(students);
        // Act
        const result = await studentService.findStudentsByName('John');
        // Assert
        expect(result).toEqual(students);
        expect(mockRepo.findStudentsByName).toHaveBeenCalledWith('John');
    });

    it('countStudentsByNames counts students by array of names', async () => {
        // Arrange
        const names = ['John', 'Mike'];
        mockRepo.countStudentsByNames.mockResolvedValue(3);
        // Act
        const result = await studentService.countStudentsByNames(names);
        // Assert
        expect(result).toBe(3);
        expect(mockRepo.countStudentsByNames).toHaveBeenCalledWith(names);
    });
    it('countStudentsByNames converts single name to array', async () => {
        // Arrange
        mockRepo.countStudentsByNames.mockResolvedValue(2);
        // Act
        const result = await studentService.countStudentsByNames('John');
        // Assert
        expect(result).toBe(2);
        expect(mockRepo.countStudentsByNames).toHaveBeenCalledWith(['John']);
    });

    it('findStudentsByMinScore returns students with minimum score', async () => {
        // Arrange
        const students = [
            {id: 1, name: 'John'},
            {id: 2, name: 'Mike'}
        ];
        mockRepo.findStudentsByMinScore.mockResolvedValue(students);
        // Act
        const result = await studentService.findStudentsByMinScore('math', '80');
        // Assert
        expect(result).toEqual(students);
        expect(mockRepo.findStudentsByMinScore).toHaveBeenCalledWith('math', 80);
    });
})
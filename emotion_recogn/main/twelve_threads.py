import main.face_nice as face
import main.album_download as ad
import _thread
import time


def multi_start(db_path):
	_thread.start_new_thread(ad.album_url, (db_path,))

	time.sleep(2)
	_thread.start_new_thread(face.evaluate_emotions, (db_path,1,11,))
	_thread.start_new_thread(face.evaluate_emotions, (db_path,2,11,))
	_thread.start_new_thread(face.evaluate_emotions, (db_path,3,11,))
	_thread.start_new_thread(face.evaluate_emotions, (db_path,4,11,))
	_thread.start_new_thread(face.evaluate_emotions, (db_path,5,11,))
	_thread.start_new_thread(face.evaluate_emotions, (db_path,6,11,))
	_thread.start_new_thread(face.evaluate_emotions, (db_path,7,11,))
	_thread.start_new_thread(face.evaluate_emotions, (db_path,8,11,))
	_thread.start_new_thread(face.evaluate_emotions, (db_path,9,11,))
	_thread.start_new_thread(face.evaluate_emotions, (db_path,10,11,))
	# for it in range(1,10):
	# 	_thread.start_new_thread(
	# 		face.evaluate_emotions, (
	# 			db_path,
	# 			it,
	# 			11
	# 		)
	# 	)

	face.evaluate_emotions(db_path, 15, 11)
